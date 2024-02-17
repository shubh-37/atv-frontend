import { useContext, useState } from "react";
import { authContext } from "../context/AuthContextProvider";
import { toast } from "react-toastify";
import "../css/login.css";
import { NOT_FOUND, SUCCESS } from "../constants";

export default function Login() {
  const { loginUser } = useContext(authContext);
  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
        <p className="signup-heading">Login to your account</p>
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
          {/* <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              id="password"
              name="password"
              onChange={(e) => inputHandler(e)}
              style={{ paddingRight: "30px", width: "86%" }}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "🙈"}
            </span>
          </div> */}
          <button type="submit" className="signup-btn">
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}
