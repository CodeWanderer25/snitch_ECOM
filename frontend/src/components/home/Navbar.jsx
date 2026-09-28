import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const Navbar = () => {
    const navigate = useNavigate();

    const { user, logout } = useAuth();
    const { cartItems } = useCart();

    const handleLogout = async () => {
        await logout();

        navigate("/login");
    };

    return (
        <nav className="w-full border-b border-slate-800 bg-slate-900">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">



                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-xl font-bold text-white transition hover:text-blue-400"
                >
                    MyShop
                </button>



                <div className="flex items-center gap-3">

      
                    <button
                        type="button"
                        onClick={() => navigate("/cart")}
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-blue-500 hover:bg-slate-700 hover:text-white"
                        aria-label="Shopping cart"
                    >

         

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835L5.61 6.75m0 0h13.14c.756 0 1.332.69 1.17 1.428l-1.2 5.5a1.2 1.2 0 0 1-1.172.944H8.41a1.2 1.2 0 0 1-1.17-.944L5.61 6.75Zm0 0L4.5 4.5m3.91 13.5a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Zm9 0a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Z"
                            />
                        </svg>


         

                        {cartItems.length > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white ring-2 ring-slate-900">
                                {cartItems.length}
                            </span>
                        )}

                    </button>



                    <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                        {user?.name || "No User"}
                    </button>




                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
};

export default Navbar;
