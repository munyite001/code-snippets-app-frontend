import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import GlobalProvider from "./context/GlobalProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <GlobalProvider>
                <App />
            </GlobalProvider>
        </BrowserRouter>
    </StrictMode>
);
