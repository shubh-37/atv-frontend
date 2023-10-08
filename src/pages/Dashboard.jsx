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
    setBarcode("hey");
  }, []);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Upload</button>
      {isOpen && <ProductForm noChangeModal={setIsOpen} />}
      <p>{barcode.length > 0 ? barcode : "Barcode value will come here"}</p>
      <button onClick={() => setCamera(!camera)}>
        {camera ? "Stop scanning" : "Scan barcode"}
      </button>
      <div className="container">
        {camera && <Scanner onDetected={onDetected} />}
      </div>
    </>
  );
}
