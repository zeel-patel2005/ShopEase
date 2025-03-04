import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-hot-toast"; // ✅ Import toast for notifications

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth0();

    // Show a loading spinner while checking authentication
    if (isLoading) return <h2>Loading...</h2>;

    // If not authenticated, show a message and redirect
    if (!isAuthenticated) {
        toast.error("You need to log in to access this page.");
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
