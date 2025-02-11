import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/LoginPage";
import Register from "./components/RegistrationPage";


function App() {
    
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;
