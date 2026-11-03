
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = "http://localhost:4000/api/v1/user";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Register User
    const register = async (formData) => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { data } = await axios.post(
                `${API_URL}/register`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setUser(data.user);
            setIsAuthenticated(true);
            setMessage(data.message);

            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Login User
    const login = async (formData) => {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { data } = await axios.post(
                `${API_URL}/login`,
                formData,
                {
                    withCredentials: true
                }
            );

            setUser(data.user);
            setIsAuthenticated(true);
            setMessage(data.message);

            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get Logged In User
    const getUser = async () => {
        try {
            const { data } = await axios.get(
                `${API_URL}/getuser`,
                {
                    withCredentials: true
                }
            );

            setUser(data.user);
            setIsAuthenticated(true);

            return data.user;
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
            return null;
        }
    };

    // Refresh User Information
    const refreshUser = async () => {
        return await getUser();
    };

    // Check Login Status When Website Loads
    useEffect(() => {
        const checkAuth = async () => {
            await getUser();
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Logout User
    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get(
                `${API_URL}/logout`,
                {
                    withCredentials: true
                }
            );

            setUser(null);
            setIsAuthenticated(false);
            setMessage(data.message);

            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Logout failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                loading,
                error,
                message,
                register,
                login,
                getUser,
                refreshUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
