import { useNavigate } from "react-router";
import Navbar from "../components/home/Navbar.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useCurrency } from "../hooks/useCurrency.js";

const Cart = () => {
  const navigate = useNavigate();

  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();

  const { convertToINR, formatINR } = useCurrency();

  // TOTAL

  const total = cartItems.reduce((sum, item) => {
    const price = convertToINR(item.price.amount);

    return sum + price * (item.quantity || 1);
  }, 0);

  <p>{formatINR(total)}</p>;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">Shopping Cart</p>

          <h1 className="mt-1 text-3xl font-bold text-white">Your Cart</h1>

          <p className="mt-2 text-sm text-slate-400">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835L5.61 6.75m0 0h13.14c.756 0 1.332.69 1.17 1.428l-1.2 5.5a1.2 1.2 0 0 1-1.172.944H8.41a1.2 1.2 0 0 1-1.17-.944L5.61 6.75Zm0 0L4.5 4.5"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Add some products to your cart to get started.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
            <div className="space-y-4">
              {cartItems.map((product) => {
                const quantity = product.quantity || 1;

                const price = product.price?.amount || 0;

                const itemTotal = price * quantity;

                const image =
                  product.images?.[0] || "https://via.placeholder.com/200";

                return (
                  <div
                    key={`${product._id}-${product.size || ""}`}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700"
                  >
                    <div className="flex gap-5">
                      {/* IMAGE */}

                      <img
                        src={image}
                        alt={product.title}
                        className="h-28 w-28 shrink-0 rounded-xl object-cover"
                      />

                      {/* PRODUCT INFO */}

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-white">
                              {product.title}
                            </h3>

                            {product.size && (
                              <p className="mt-1 text-xs text-slate-500">
                                Size:{" "}
                                <span className="text-slate-300">
                                  {product.size}
                                </span>
                              </p>
                            )}

                            <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                              {product.description}
                            </p>
                          </div>

                          {/* ITEM TOTAL */}

                          <div className="shrink-0 text-right">
                            <p className="text-lg font-bold text-blue-400">
                              $
                              {new Intl.NumberFormat("en-IN").format(itemTotal)}
                            </p>

                            {quantity > 1 && (
                              <p className="mt-1 text-xs text-slate-500">
                                ${new Intl.NumberFormat("en-IN").format(price)}{" "}
                                × {quantity}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4">
                          {/* QUANTITY */}

                          <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950">
                            {/* MINUS */}

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  product._id,
                                  quantity - 1,
                                  product.size,
                                )
                              }
                              disabled={quantity <= 1}
                              className="flex h-10 w-10 items-center justify-center text-lg font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              −
                            </button>

                            {/* QUANTITY */}

                            <div className="flex h-10 min-w-10 items-center justify-center border-x border-slate-700 px-3 text-sm font-semibold text-white">
                              {quantity}
                            </div>

                            {/* PLUS */}

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  product._id,
                                  quantity + 1,
                                  product.size,
                                )
                              }
                              className="flex h-10 w-10 items-center justify-center text-lg font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                            >
                              +
                            </button>
                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(product._id, product.size)
                            }
                            className="text-sm font-medium text-red-400 transition hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>


            <div className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:sticky lg:top-6">
              <h2 className="text-lg font-semibold text-white">
                Order Summary
              </h2>

              {/* ITEMS */}

              <div className="mt-5 flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-sm text-slate-400">Items</span>

                <span className="text-sm font-medium text-white">
                  {cartItems.reduce(
                    (sum, item) => sum + (item.quantity || 1),
                    0,
                  )}
                </span>
              </div>

              {/* SUBTOTAL */}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-base font-medium text-slate-300">
                  Subtotal
                </span>

                <span className="text-lg font-semibold text-white">
                  ₹{new Intl.NumberFormat("en-IN").format(total)}
                </span>
              </div>

              {/* SHIPPING */}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-slate-400">Shipping</span>

                <span className="text-sm font-medium text-green-400">Free</span>
              </div>

              {/* TOTAL */}

              <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-5">
                <span className="text-base font-semibold text-white">
                  Total
                </span>

                <span className="text-2xl font-bold text-white">
                  ₹{new Intl.NumberFormat("en-IN").format(total)}
                </span>
              </div>

              {/* CHECKOUT */}

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Checkout
              </button>

              {/* CLEAR */}

              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
