import { createContext } from "react";
import { useState } from "react";
export const productContext = createContext();
import axios from "axios";
import {
  BAD_REQUEST,
  NOT_FOUND,
  PRODUCT_FOUND,
  SUCCESS,
  UNKNOWN,
  AUTH_FAILED
} from "../constants";
const {VITE_API_URL} = import.meta.env;
// eslint-disable-next-line react/prop-types
export default function ProductContextProvider({ children }) {
  const [barcode, setBarcode] = useState("No barcode available");
  const [product, setProduct] = useState({});
  async function createProduct(product) {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.post(VITE_API_URL, product, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        return PRODUCT_FOUND;
      } else if (response.status === 201) {
        return SUCCESS;
      }
    } catch (error) {
      if (error.response.status === 500) {
        return UNKNOWN;
      } else if (error.response.status === 400) {
        return BAD_REQUEST;
      } else if (error.response.status === 403 || error.response.status === 401){
        return AUTH_FAILED;
      }
    }
  }

  async function searchBarcode(barcode) {
    try {
      const token = window.localStorage.getItem("token");
      const response = await axios.get(`${VITE_API_URL}/product`, {
        params: { barcode },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setProduct(response.data.product);
        return SUCCESS;
      }
    } catch (error) {
      if (error.response.status === 404) {
        return NOT_FOUND;
      }else if (error.response.status === 400) {
        return BAD_REQUEST;
      } else if (error.response.status === 403 || error.response.status === 401){
        return AUTH_FAILED;
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
