import { createContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const authContext = createContext();
import axios from "axios";
import { NOT_FOUND, SUCCESS, UNKNOWN } from "../constants";

// eslint-disable-next-line react/prop-types
export default function AuthContextProvider({ children }) {
  const [isLogin, setIslogin] = useState(false);
  const navigate = useNavigate();
  async function loginUser(user) {
    try {
      const response = await axios.post(
        "https://150.129.182.25:3001/login",
        user
      );
      console.log(response);
      if (response.status === 200) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setIslogin(true);
          navigate("/");
          return SUCCESS;
        }
      }
    } catch (error) {
      if (error.response.status === 500) {
        return UNKNOWN;
      } else if (error.response.status === 404) {
        return NOT_FOUND;
      }
    }
  }

  function logoutUser() {
    localStorage.removeItem("token");
    setIslogin(false);
  }
  return (
    <authContext.Provider value={{ loginUser, isLogin, logoutUser }}>
      {children}
    </authContext.Provider>
  );
}
