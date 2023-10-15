import { useContext } from "react";
import { NOT_FOUND, SUCCESS } from "../constants";
import { productContext } from "../context/ProductContextProvider";
import FileBarcodeDecoder from "./FileUpload";
import "../css/modal.css";

// eslint-disable-next-line react/prop-types
export default function BarcodeModal({ closeModal, openProductForm }) {
  const { searchBarcode, barcode, setBarcode } = useContext(productContext);
  async function searchHandler() {
    if (
      barcode === "No barcode available" ||
      barcode === "No barcode found in the image."
    ) {
      console.log("send error toast");
    } else {
      const response = await searchBarcode(barcode);
      if (response === SUCCESS) {
        console.log("send toast");
        closeModal(false);
        openProductForm(true);
      } else if (response === NOT_FOUND) {
        console.log("send toast");
        closeModal(false);
        openProductForm(true);
      }
    }
  }
  return (
    <>
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          opacity: "0.5",
          backgroundColor: "grey",
        }}
      ></div>
      <div className="modal-background">
        <div className="modal-container">
          <div className="close-btn">
            <button onClick={() => closeModal(false)}> X </button>
          </div>
          <div className="modal-header">
            <h2>Upload/Type Barcode</h2>
          </div>
          <div className="modal-body">
            <p>Enter barcode manually</p>
            <span>
              <input
                type="text"
                name=""
                id=""
                onChange={(e) => setBarcode(e.target.value)}
              />
              <button onClick={() => searchHandler()}>Upload</button>
            </span>
            <h3>OR</h3>
            <FileBarcodeDecoder />
          </div>
          <div className="modal-footer">
            <button onClick={() => closeModal(false)} className="cancel-btn">
              Cancel
            </button>
            <button onClick={() => searchHandler()}>Upload Barcode</button>
          </div>
        </div>
      </div>
    </>
  );
}
