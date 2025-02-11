import { Navigate, Outlet } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalProvider";

export default function PrivateRoute() {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
