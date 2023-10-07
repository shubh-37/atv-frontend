import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import AuthContextProvider from "./context/AuthContextProvider.jsx";
import ProductContextProvider from "./context/ProductContextProvider.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        <ProductContextProvider>
          <App />
        </ProductContextProvider>
      </AuthContextProvider>
    </Router>
  </React.StrictMode>
);
