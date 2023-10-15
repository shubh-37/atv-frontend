import { useState } from "react";
import BarcodeModal from "../components/BarcodeModal";
import ProductForm from "../components/ProductForm";
import "../css/dashboard.css";

export default function Dashboard() {
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isProductFormOpen, setProductFormOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsBarcodeOpen(true)}>Scan barcode</button>
      {isBarcodeOpen && (
        <BarcodeModal
          closeModal={setIsBarcodeOpen}
          openProductForm={setProductFormOpen}
        />
      )}
      {isProductFormOpen && <ProductForm closeModal={setProductFormOpen} closeBarcodeModal={setIsBarcodeOpen}/>}
    </div>
  );
}
