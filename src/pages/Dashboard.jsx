import { useEffect } from "react";
import { useContext, useState } from "react";
import ProductForm from "../components/ProductForm";
import { productContext } from "../context/ProductContextProvider";
import Scanner from "../components/Scanner";
export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [camera, setCamera] = useState(false);
  const { barcode, setBarcode } = useContext(productContext);
  const onDetected = (result) => {
    setBarcode(result);
  };
  useEffect(() => {
    setBarcode("hey hi");
  }, []);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Upload</button>
      {isOpen && <ProductForm noChangeModal={setIsOpen} />}
      <p>{barcode.length > 0 ? barcode : "Barcode value will come here"}</p>
      {/* <button onClick={() => setCamera(!camera)}>
        {camera ? "Stop scanning" : "Scan barcode"}
      </button>
      <div className="container">
        {camera && <Scanner onDetected={onDetected} />}
      </div> */}

    <div className="input-field">
        <label htmlFor="isbn_input">Code 93:</label>
        <input id="isbn_input" className="isbn" type="text" />
        <button type="button" className="icon-barcode button scan">Scan Barcode</button>
        <input type="file" id="file" capture/>
    </div>
    </>
  );
}
