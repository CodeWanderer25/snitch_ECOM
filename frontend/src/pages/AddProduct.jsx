import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const API_URL = "http://localhost:3000/api/products";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

const INITIAL_FORM_DATA = {
  title: "",
  description: "",
  amount: "",
  currency: "INR",
  sizes: [],
};

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // INPUT CHANGE


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  // SIZE SELECTION


  const handleSizeChange = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.some((item) => item.size === size);

      if (exists) {
        return {
          ...prev,
          sizes: prev.sizes.filter((item) => item.size !== size),
        };
      }

      return {
        ...prev,
        sizes: [
          ...prev.sizes,
          {
            size,
            stock: 0,
          },
        ],
      };
    });

    setError("");
    setSuccess("");
  };


  // STOCK CHANGE

  const handleStockChange = (size, stock) => {
    setFormData((prev) => ({
      ...prev,

      sizes: prev.sizes.map((item) =>
        item.size === size
          ? {
              ...item,
              stock: stock === "" ? "" : Number(stock),
            }
          : item,
      ),
    }));

    setError("");
  };


  // IMAGE SELECTION


  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    const newImages = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    e.target.value = "";

    setError("");
    setSuccess("");
  };


  // REMOVE IMAGE


  const removeImage = (index) => {
    setImages((prev) => {
      const imageToRemove = prev[index];

      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return prev.filter((_, imageIndex) => imageIndex !== index);
    });
  };


  // VALIDATION


  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Product title is required.";
    }

    if (!formData.description.trim()) {
      return "Product description is required.";
    }

    const amount = Number(formData.amount);

    if (!formData.amount || Number.isNaN(amount) || amount <= 0) {
      return "Please enter a valid price.";
    }

    if (!formData.sizes.length) {
      return "Please select at least one size.";
    }

    const invalidStock = formData.sizes.some(
      (item) =>
        item.stock === "" ||
        item.stock === null ||
        item.stock === undefined ||
        Number(item.stock) < 0,
    );

    if (invalidStock) {
      return "Please enter valid stock for every selected size.";
    }

    if (!images.length) {
      return "Please select at least one product image.";
    }

    return null;
  };

 
  // SUBMIT


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("Your session has expired. Please login again.");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

     
      // BASIC INFORMATION


      data.append("title", formData.title.trim());

      data.append("description", formData.description.trim());


      // PRICE


      data.append(
        "price",
        JSON.stringify({
          amount: Number(formData.amount),
          currency: formData.currency,
        }),
      );


      // SIZES


      data.append("sizes", JSON.stringify(formData.sizes));


      // IMAGES


      images.forEach(({ file }) => {
        data.append("images", file);
      });


      const response = await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

        withCredentials: true,
      });



      setSuccess("Product created successfully!");

   
      // CLEANUP PREVIEW URLS


      images.forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
      });

  
      // REDIRECT


      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 700);
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      console.error("STATUS:", error.response?.status);

      console.error("BACKEND RESPONSE:", error.response?.data);

      // TOKEN EXPIRED 
  

      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");

        localStorage.removeItem("user");

        setError("Your session has expired. Please login again.");

        setTimeout(() => {
          navigate("/login", {
            replace: true,
          });
        }, 1000);

        return;
      }

  
      // FORBIDDEN
   

      if (error.response?.status === 403) {
        setError("You are not authorized to create products.");

        return;
      }

      // OTHER ERRORS


      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create product.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">


      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
              Seller
            </p>

           
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={loading}
            className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:opacity-50"
          >
            ← Products
          </button>
        </div>
      </header>



      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        {/* HEADER */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create a new product
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
            Add product details, pricing, sizes, stock and images.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <span className="mt-0.5">⚠</span>

            <p>{error}</p>
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            <span className="mt-0.5">✓</span>

            <p>{success}</p>
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1fr_320px]"
        >


          <div className="space-y-6">
            {/* PRODUCT DETAILS */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl shadow-black/20">
              <div className="mb-6">
                <p className="mb-1 text-xs uppercase tracking-wider text-zinc-600">
                  Step 01
                </p>

                <h3 className="text-xl font-semibold">Product Information</h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Basic information about your product.
                </p>
              </div>

              <div className="space-y-5">
                {/* TITLE */}

                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Product title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Classic Cotton T-Shirt"
                    disabled={loading}
                    required
                    className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3.5 text-sm text-white placeholder-zinc-700 outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-white/5 disabled:opacity-50"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe material, fit, quality and other product details..."
                    disabled={loading}
                    required
                    className="w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3.5 text-sm text-white placeholder-zinc-700 outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-white/5 disabled:opacity-50"
                  />
                </div>
              </div>
            </section>

            {/* PRICING */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
              <div className="mb-6">
                <p className="mb-1 text-xs uppercase tracking-wider text-zinc-600">
                  Step 02
                </p>

                <h3 className="text-xl font-semibold">Pricing</h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Set the selling price and currency.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <div>
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-600">
                      ₹
                    </span>

                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="999"
                      disabled={loading}
                      required
                      className="w-full rounded-xl border border-zinc-800 bg-black py-3.5 pl-9 pr-4 text-sm text-white placeholder-zinc-700 outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-white/5"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Currency
                  </label>

                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3.5 text-sm text-white outline-none focus:border-zinc-500"
                  >
                    <option value="INR">INR — Indian Rupee</option>

                    <option value="USD">USD — US Dollar</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SIZES */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
              <div className="mb-6">
                <p className="mb-1 text-xs uppercase tracking-wider text-zinc-600">
                  Step 03
                </p>

                <h3 className="text-xl font-semibold">Sizes & Stock</h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Select available sizes and define stock.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((size) => {
                  const selected = formData.sizes.some(
                    (item) => item.size === size,
                  );

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={loading}
                      onClick={() => handleSizeChange(size)}
                      className={`min-w-14 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                        selected
                          ? "border-white bg-white text-black"
                          : "border-zinc-800 bg-black text-zinc-500 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {formData.sizes.length > 0 && (
                <div className="mt-6 space-y-3">
                  {formData.sizes.map((item) => (
                    <div
                      key={item.size}
                      className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-black p-3"
                    >
                      <div className="flex h-11 w-14 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
                        {item.size}
                      </div>

                      <div className="flex-1">
                        <p className="mb-1 text-xs text-zinc-600">
                          Stock quantity
                        </p>

                        <input
                          type="number"
                          min="0"
                          value={item.stock}
                          onChange={(e) =>
                            handleStockChange(item.size, e.target.value)
                          }
                          disabled={loading}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* IMAGES */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
              <div className="mb-6">
                <p className="mb-1 text-xs uppercase tracking-wider text-zinc-600">
                  Step 04
                </p>

                <h3 className="text-xl font-semibold">Product Images</h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Upload high-quality images of your product.
                </p>
              </div>

              <label
                className={`group flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-black px-6 py-12 text-center transition ${
                  loading
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:border-zinc-600 hover:bg-zinc-950"
                }`}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 transition group-hover:border-zinc-700">
                  <svg
                    className="h-7 w-7 text-zinc-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5h10.5A2.25 2.25 0 0019.5 17.25v-10.5A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>

                <span className="text-sm font-medium text-zinc-300">
                  Click to upload images
                </span>

                <span className="mt-2 text-xs text-zinc-600">
                  PNG, JPG, JPEG or WEBP
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  onChange={handleImageChange}
                  disabled={loading}
                  className="hidden"
                />
              </label>

              {images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={`${image.file.name}-${image.file.lastModified}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-black"
                    >
                      <img
                        src={image.preview}
                        alt={image.file.name}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={loading}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-lg text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
   

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
              <div className="border-b border-zinc-800 p-6">
                <p className="text-xs uppercase tracking-wider text-zinc-600">
                  Preview
                </p>

                <h3 className="mt-1 text-xl font-semibold">Product Summary</h3>
              </div>

              <div className="p-6">
                {/* PREVIEW IMAGE */}

                <div className="mb-6 aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-black">
                  {images[0] ? (
                    <img
                      src={images[0].preview}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-zinc-700">
                      <svg
                        className="mb-3 h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4.5 19.5h15a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z"
                        />
                      </svg>

                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>

                {/* PRODUCT NAME */}

                <div className="mb-5">
                  <p className="text-xs text-zinc-600">Product</p>

                  <p className="mt-1 truncate font-medium">
                    {formData.title || "Product name"}
                  </p>
                </div>

                {/* PRICE */}

                <div className="mb-5">
                  <p className="text-xs text-zinc-600">Price</p>

                  <p className="mt-1 text-2xl font-bold">
                    {formData.amount
                      ? `${formData.currency} ${formData.amount}`
                      : "—"}
                  </p>
                </div>

                {/* STATS */}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-zinc-800 bg-black p-4">
                    <p className="text-xs text-zinc-600">Sizes</p>

                    <p className="mt-1 text-xl font-semibold">
                      {formData.sizes.length}
                    </p>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-black p-4">
                    <p className="text-xs text-zinc-600">Images</p>

                    <p className="mt-1 text-xl font-semibold">
                      {images.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* CREATE BUTTON */}

              <div className="border-t border-zinc-800 p-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating Product..." : "Create Product"}
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-zinc-600">
                  Your product will be saved to your seller account.
                </p>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
