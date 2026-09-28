import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const alreadyExists = prev.some(
                (item) => item._id === product._id
            );

            if (alreadyExists) {
                return prev;
            }

            return [...prev, product];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) =>
            prev.filter((item) => item._id !== productId)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const updateQuantity = (productId, quantity, size) => {
    if (quantity < 1) {
        return;
    }

    setCartItems((prev) =>
        prev.map((item) => {
            if (
                item._id === productId &&
                item.size === size
            ) {
                return {
                    ...item,
                    quantity,
                };
            }

            return item;
        })
    );
};

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                updateQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
