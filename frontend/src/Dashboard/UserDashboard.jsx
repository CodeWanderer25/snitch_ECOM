import Navbar from "../components/home/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService.js";

const UserDashboard = () => {
  const { user } = useAuth();
  const { cartItems, addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllProducts();

        

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

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 md:p-12">
          {/* Background Glow */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative z-10">
            <p className="text-sm font-medium text-blue-400">Welcome back</p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
              {user?.name || "User"}
            </h1>

            <p className="mt-4 max-w-xl text-slate-400">
              Discover amazing products, explore new arrivals and find something
              you'll love.
            </p>

            <button
              type="button"
              onClick={() =>
                document.getElementById("products")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30"
            >
              View Products
            </button>
          </div>
        </section>

        <section id="products" className="mt-12">
          {/* Header */}

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-400">Explore</p>

              <h2 className="mt-1 text-3xl font-bold text-white">
                Latest Products
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Explore our latest products and find something perfect for you.
              </p>
            </div>

            <button
              type="button"
              className="w-fit rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              View All
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

                <p className="mt-4 text-sm text-slate-400">
                  Loading products...
                </p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl">
                🛍️
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                No products available
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                There are currently no products available. Please check back
                later.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const isAdded = cartItems.some(
                  (item) => item._id === product._id,
                );

                return (
                  <ProductCard
                    key={product._id}
                    product={product}
                    added={isAdded}
                    onAddToCart={addToCart}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const ProductCard = ({ product, added, onAddToCart }) => {
  const image = product.images?.[0] || "https://via.placeholder.com/500";

  const amount = product.price?.amount ?? 0;

  const currency = product.price?.currency ?? "INR";

  const formattedPrice = new Intl.NumberFormat("en-IN").format(amount);

  const shortDescription =
    product.description?.length > 75
      ? `${product.description.substring(0, 75)}...`
      : product.description;

  const currencySymbol = currency === "INR" ? "₹" : "$";

  return (
    <article
      className="
                group overflow-hidden
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-slate-700
                hover:shadow-2xl
                hover:shadow-black/20
            "
    >
      <div className="relative h-56 overflow-hidden bg-slate-800">
        <img
          src={image}
          alt={product.title}
          loading="lazy"
          className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                    "
        />

        <div
          className="
                        absolute
                        inset-0
                        from-slate-950/50
                        via-transparent
                        to-transparent
                        opacity-0
                        transition
                        duration-300
                        group-hover:opacity-100
                    "
        />

        <span
          className="
                        absolute
                        left-3
                        top-3
                        rounded-full
                        border
                        border-white/10
                        bg-slate-950/70
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-white
                        backdrop-blur-md
                    "
        >
          New
        </span>
      </div>

      <div className="p-5">
        {/* Title */}

        <h3
          title={product.title}
          className="truncate text-lg font-semibold text-white"
        >
          {product.title}
        </h3>

        {/* Description */}

        <p className="mt-2 h-10 text-sm leading-5 text-slate-400">
          {shortDescription}
        </p>

        {/* Price */}

        <div className="mt-5">
          <p className="text-xs text-slate-500">Price</p>

          <p className="mt-1 text-xl font-bold text-white">
            {currencySymbol} {formattedPrice}
          </p>
        </div>

        <button
          type="button"
          disabled={added}
          onClick={() => onAddToCart(product)}
          className={`
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        transition-all
                        duration-200

                        ${
                          added
                            ? `
                                    cursor-default
                                    border
                                    border-emerald-500/30
                                    bg-emerald-500/10
                                    text-emerald-400
                                `
                            : `
                                    border
                                    border-blue-500/30
                                    bg-blue-600
                                    text-white
                                    shadow-lg
                                    shadow-blue-600/10
                                    hover:bg-blue-700
                                    hover:shadow-blue-600/20
                                `
                        }
                    `}
        >
          {added ? (
            <>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                ✓
              </span>
              Added to Cart
            </>
          ) : (
            <>
              <span className="text-lg leading-none">+</span>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default UserDashboard;
