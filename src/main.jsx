import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./main.scss";
import App from "./app/App";
import { AuthProvider } from "./app/components/context/authProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter basename="/CarShopFrontend">
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
