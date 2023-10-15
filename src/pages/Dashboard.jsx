import { useState } from "react";
import BarcodeModal from "../components/BarcodeModal";
import ProductForm from "../components/ProductForm";
import "../css/dashboard.css";

export default function Dashboard() {
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isProductFormOpen, setProductFormOpen] = useState(false);
  return (
    <div className="container1">
      <h2>Click to upload barcode</h2>
      <div>
        <button className="scan" onClick={() => setIsBarcodeOpen(true)}>
          Scan barcode
        </button>
        {isBarcodeOpen && (
          <BarcodeModal
            closeModal={setIsBarcodeOpen}
            openProductForm={setProductFormOpen}
          />
        )}
        {isProductFormOpen && (
          <ProductForm
            closeModal={setProductFormOpen}
            closeBarcodeModal={setIsBarcodeOpen}
          />
        )}
      </div>
    </div>
  );
}
