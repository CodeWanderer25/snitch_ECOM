import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import axios from "axios";


// Create Context


const AuthContext = createContext(null);


// API Configuration


const API_URL = "https://snitch-ecom-27j6.onrender.com/api/auth";


// Auth Provider


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Restore Authentication


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");

        if (storedUser && accessToken) {
            try {
                const parsedUser = JSON.parse(storedUser);


                setUser(parsedUser);
            } catch (error) {
                console.error(
                    "Failed to restore user:",
                    error
                );

                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
            }
        }

        setLoading(false);
    }, []);

    // REGISTER
   

    const register = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${API_URL}/register`,
                formData
            );

            const data = response.data;

            console.log(
                "REGISTER RESPONSE:",
                data
            );

            if (data.user) {
                setUser(data.user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            if (data.accessToken) {
                localStorage.setItem(
                    "accessToken",
                    data.accessToken
                );
            }

            return data;

        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Registration failed";

            setError(message);

            throw new Error(message);

        } finally {
            setLoading(false);
        }
    };


    // LOGIN


    const login = async (email, password) => {
    try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
            `${API_URL}/login`,
            {
                email,
                password,
            },
            {
                withCredentials: true,
            }
        );

        const responseData = response.data;

        // Backend response:
        // {
        //   message: "...",
        //   data: {
        //      user: {...},
        //      accessToken: "..."
        //   }
        // }

        const userData = responseData.data?.user;
        const accessToken = responseData.data?.accessToken;

        if (!userData) {
            throw new Error("User data missing from login response");
        }

        // Save user in React state
        setUser(userData);

        // Save user in localStorage
        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        // Save access token
        if (accessToken) {
            localStorage.setItem(
                "accessToken",
                accessToken
            );
        }

        return responseData;

    } catch (error) {

        const message =
            error.response?.data?.message ||
            error.message ||
            "Login failed";

        setError(message);

        throw new Error(message);

    } finally {
        setLoading(false);
    }
};


    // LOGOUT


    const logout = async () => {
        try {
            await axios.post(
                `${API_URL}/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.error(
                "Logout API error:",
                error
            );
        } finally {
            setUser(null);

            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");

            setError(null);
        }
    };


    // Context Value


    const value = {
        user,
        loading,
        error,

        register,
        login,
        logout,

        isAuthenticated: Boolean(user),
    };




    // Provider


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


// Custom Hook


export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};
