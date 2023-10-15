import { createContext } from "react";
import { useState } from "react";
export const productContext = createContext();
import axios from "axios";
import { BAD_REQUEST, NOT_FOUND, SUCCESS, UNKNOWN } from "../constants";

// eslint-disable-next-line react/prop-types
export default function ProductContextProvider({ children }) {
  const [barcode, setBarcode] = useState("No barcode available");
  const [product, setProduct] = useState({});
  async function createProduct(product) {
    try {
      const response = await axios.post("http://localhost:3001", product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      if (response.status === 200) {
        return SUCCESS;
      }
    } catch (error) {
      if (error.response.status === 500) {
        return UNKNOWN;
      } else if (error.response.status === 400) {
        return BAD_REQUEST;
      }
    }
  }

  async function searchBarcode(barcode) {
    try {
      const response = await axios.get("http://localhost:3001/product/", {
        params: { barcode },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.status === 200) {
        setProduct(response.data.product);
        return SUCCESS;
      }
    } catch (error) {
      if (error.response.status === 404) {
        return NOT_FOUND;
      }
    }
  }
  return (
    <productContext.Provider
      value={{
        createProduct,
        barcode,
        product,
        setBarcode,
        searchBarcode,
        setProduct,
      }}
    >
      {children}
    </productContext.Provider>
  );
}
