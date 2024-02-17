import { useContext, useState } from "react";
import { authContext } from "../context/AuthContextProvider";
import { toast } from "react-toastify";
import "../css/login.css";
import { NOT_FOUND, SUCCESS } from "../constants";

export default function VerifyOtp() {
  const { loginUser } = useContext(authContext);
  const [user, setUser] = useState({});

  function notify(event, type) {
    event.preventDefault();
    if (type === NOT_FOUND) {
      toast.error("User not found!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (type === SUCCESS) {
      toast.success("Login successful!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Please try again after sometime!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  function inputHandler(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }
  async function submitLogin(e) {
    e.preventDefault();
    const response = await loginUser(user);
    if (response === SUCCESS) {
      notify(e, response);
    } else if (response === NOT_FOUND) {
      notify(e, response);
    } else {
      notify(e, response);
    }
  }

  return (
    <div className="background">
      <div className="signup-parent">
        <p className="signup-heading">Enter your OTP</p>
        <form onSubmit={(e) => submitLogin(e)} className="form-parent">
          <label htmlFor="mobileNumber">Enter mobile number</label>
          <input
            type="number"
            name="mobileNumber"
            id="mobileNumber"
            placeholder="Mobile Number"
            required
            onChange={(e) => inputHandler(e)}
          />
          <button type="submit" className="signup-btn">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
