import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/LoginPage";
import Register from "./components/RegistrationPage";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/privateRoute";

function App() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
