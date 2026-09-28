import { Routes, Route, Navigate } from "react-router";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./components/home/Profile";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
        />
        
        <Route path="/" element={<Dashboard />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route
                path="/profile"
                element={<Profile />}
                
        />

        <Route path="/seller/products/create" element={<AddProduct />} />
        <Route path="/cart" element={<Cart />} />

        

        </Routes>
    );
}

export default App;