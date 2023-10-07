import { createContext } from "react";
import { useState } from "react";
export const productContext = createContext();
import axios from "axios";
import { NOT_FOUND, SUCCESS, UNKNOWN } from "../constants";

// eslint-disable-next-line react/prop-types
export default function ProductContextProvider({ children }) {
  const [barcode, setBarcode] = useState("");
  async function createProduct(product) {
    try {
      const response = await axios.post("http://localhost:3001", product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
    } catch (error) {
      if (error.response.status === 500) {
        return UNKNOWN;
      } else if (error.response.status === 404) {
        return NOT_FOUND;
      }
    }
  }
  return (
    <productContext.Provider value={{ createProduct, barcode, setBarcode }}>
      {children}
    </productContext.Provider>
  );
}
