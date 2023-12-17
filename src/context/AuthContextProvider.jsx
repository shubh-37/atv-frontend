import { createContext } from "react";
import { useNavigate } from "react-router-dom";
export const authContext = createContext();
import axios from "axios";
import { NOT_FOUND, SUCCESS, UNKNOWN } from "../constants";
const {VITE_API_URL} = import.meta.env;
// eslint-disable-next-line react/prop-types
export default function AuthContextProvider({ children }) {
  const navigate = useNavigate();
  async function loginUser(user) {
    try {
      const response = await axios.post(
        `${VITE_API_URL}/login`,
        user
      );
      console.log(response);
      if (response.status === 200) {
        if (response.data.token) {
          window.localStorage.setItem("token", response.data.token);
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
    window.localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <authContext.Provider value={{ loginUser, logoutUser }}>
      {children}
    </authContext.Provider>
  );
}
