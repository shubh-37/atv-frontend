import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RequiresAuth from "./components/RequiresAuth";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequiresAuth><Dashboard /></RequiresAuth>} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
