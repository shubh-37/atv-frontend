import { useState } from "react";
import ProductForm from "../components/ProductForm";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Upload</button>
      {isOpen && <ProductForm noChangeModal={setIsOpen} />}
    </>
  );
}
