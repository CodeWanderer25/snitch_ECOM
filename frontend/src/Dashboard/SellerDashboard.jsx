import Navbar from "../components/home/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getMyProducts, deleteProduct } from "../services/productService.js";

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyProducts();


        setProducts(response || []);
      } catch (error) {
        console.error("FETCH PRODUCTS ERROR:", error);

        setError(error.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalStock = products.reduce((total, product) => {
    const productStock =
      product.sizes?.reduce((sum, item) => sum + Number(item.stock || 0), 0) ||
      0;

    return total + productStock;
  }, 0);

  const totalRevenue = 0;

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(productId);
      setError("");

      await deleteProduct(productId);

      // Remove product from UI immediately
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId),
      );
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      setError(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8 md:p-10">
          <p className="text-sm font-medium text-purple-400">
            Seller Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Welcome back, {user?.name}
          </h1>

          <p className="mt-3 max-w-xl text-slate-400">
            Manage your products and keep track of your store.
          </p>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Products" value={products.length} />

          <StatCard title="Total Stock" value={totalStock} />

          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
          />
        </section>

        <section className="mt-10">
          {/* Header */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Products</h2>

              <p className="mt-1 text-sm text-slate-400">
                Manage, delete your products.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/seller/products/create")}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
               Add Product
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

  

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-white" />

              <p className="mt-4 text-sm text-slate-400">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
              <h3 className="text-xl font-semibold text-white">
                No products yet
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Start by adding your first product to your store.
              </p>

              <button
                type="button"
                onClick={() => navigate("/seller/products/create")}
                className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-800 bg-slate-950">
                    <tr>
                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Product
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Price
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Stock
                      </th>

                      <th className="px-6 py-4 text-sm font-medium text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <ProductRow
                        key={product._id}
                        product={product}
                        onEdit={() =>
                          navigate(`/seller/products/edit/${product._id}`)
                        }
                        onDelete={() => handleDeleteProduct(product._id)}
                        deleting={deletingId === product._id}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};



const StatCard = ({ title, value }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
    </div>
  );
};


const ProductRow = ({ product, onEdit, onDelete, deleting }) => {
  const stock =
    product.sizes?.reduce(
      (total, item) => total + Number(item.stock || 0),
      0,
    ) || 0;

  const currency = product.price?.currency || "INR";

  const amount = product.price?.amount || 0;

  const image = product.images?.[0] || "https://via.placeholder.com/100";

  return (
    <tr className="border-b border-slate-800 last:border-none">
      {/* PRODUCT */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <img
            src={image}
            alt={product.title}
            className="h-14 w-14 rounded-lg object-cover"
          />

          <div>
            <p className="font-medium text-white">{product.title}</p>

            <p className="mt-1 text-xs text-slate-500">
              {product.sizes?.length || 0} sizes
            </p>
          </div>
        </div>
      </td>

      {/* PRICE */}

      <td className="px-6 py-5 text-slate-300">
        {currency === "INR" ? "₹" : "$"}

        {amount}
      </td>

      {/* STOCK */}

      <td className="px-6 py-5">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            stock > 0
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {stock > 0 ? `${stock} in stock` : "Out of stock"}
        </span>
      </td>

      {/* ACTIONS */}

      <td className="px-6 py-5">
        <div className="flex gap-2">
          {/* <button
                        type="button"
                        onClick={onEdit}
                        className="rounded-lg border border-blue-500/40 px-3 py-2 text-sm text-blue-400 transition hover:bg-blue-500/10"
                    >
                        Edit
                    </button> */}

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SellerDashboard;
