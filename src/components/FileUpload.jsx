import { useState } from "react";
import Quagga from "quagga";

const FileBarcodeDecoder = () => {
  const [file, setFile] = useState(null);
  const [barcodeOutput, setBarcodeOutput] = useState("No barcode selected");
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const decodeBarcodeFromFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageBase64 = event.target.result;

        // Initialize QuaggaJS
        Quagga.decodeSingle(
          {
            src: imageBase64,
            numOfWorkers: 0,
            decoder: { readers: ["code_93_reader"] }, // Use the Code 93 reader
            locate: true,
            area: { top: "10%", right: "10%", left: "10%", bottom: "10%" }, // Adjust the area of interest
            // Adjust other properties as needed
          },
          (result) => {
            if (result && result.codeResult) {
              const decodedBarcode = result.codeResult.code;
              setBarcodeOutput(decodedBarcode);
              // Handle the decoded barcode as needed
            } else {
              setBarcodeOutput("No barcode found in the image.");
            }
          }
        );
      };

      // Read the selected file as a data URL
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected.");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div>Decoded Barcode: {barcodeOutput}</div>
      <button onClick={decodeBarcodeFromFile}>Decode Barcode</button>
    </div>
  );
};

export default FileBarcodeDecoder;
