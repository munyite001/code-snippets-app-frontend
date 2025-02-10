import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
}

export default App;
