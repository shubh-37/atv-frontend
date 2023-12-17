import { useState } from "react";
import { useContext } from "react";
import { productContext } from "../context/ProductContextProvider";

const FileBarcodeDecoder = () => {
  const { barcode, setBarcode } = useContext(productContext);
  const [file, setFile] = useState(null);
  // const [barcodeOutput, setBarcodeOutput] = useState("No barcode selected");
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    setFile(URL.createObjectURL(selectedFile));
  };

  const decodeBarcodeFromFile = () => {
    if (file) {
      // check compatibility
      if (!("BarcodeDetector" in globalThis)) {
        alert("Barcode Detector is not supported by this browser.");
      } else {
        console.log("Barcode Detector supported!");

        // create new detector
        //   const reader = new FileReader();
        // reader.onload = (event) => {
        console.log(event.target.result);
        console.log(file instanceof Blob);
        // const imageBase64 = event.target.result;
        const imageEl = document.getElementById("barcodeImageEle");
        const barcodeDetector = new BarcodeDetector({
          formats: ["code_93"],
        });
        barcodeDetector
          .detect(imageEl)
          .then((barcodes) => {
            barcodes.forEach((barcode) => {console.log(barcode.rawValue); setBarcode(barcode.rawValue);});
          })
          .catch((err) => {
            console.log(err);
          });
        // }
        // reader.readAsDataURL(file);
      }
    } else {
      console.error("No file selected.");
    }
  };

  return (
    <div className="modal-body">
      <p>Upload a clear barcode image</p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div style={{padding: '20px'}}>
      <img src={file} id="barcodeImageEle" style={{'height': '200px',  width: '90vw'  }} alt="image of barcode" />
      </div>
      <button className="button1" onClick={decodeBarcodeFromFile}>
        Decode Barcode
      </button>
      <div>Decoded Barcode: {barcode}</div>
    </div>
  );
};

export default FileBarcodeDecoder;
