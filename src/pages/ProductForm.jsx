import { useRef } from "react";
import { useState } from "react";
import Webcam from "react-webcam";
import Quagga from "quagga";
import "../css/modal.css";
// eslint-disable-next-line react/prop-types
export default function ProductForm({ noChangeModal }) {
  const [scanBarcode, setScanBarcode] = useState(false);
  const [click, setClick] = useState(false);
  const [code, setCode] = useState("shubh");
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const uploadImage = () => {
    if (capturedImage) {
      const formData = new FormData();
      formData.append("image", capturedImage);

      // Send the captured image to the server using Axios or your preferred HTTP library
      // axios.post("/upload", formData).then((response) => {
      //   // Handle the server response as needed
      //   console.log("Image uploaded:", response.data);
      // });
      console.log(formData);
    }
  };
  function startBarcodeScanning() {
    setScanBarcode(true);
    const scannerContainer = document.getElementById("scanner-container"); // Check if 'scanner-container' exists in your HTML
    if (!scannerContainer) {
      console.error('Element with id "scanner-container" not found.');
      return;
    }
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: scannerContainer,
          constraints: {
            width: 300,
            height: 300,
          },
        },
        decoder: {
          readers: ["code_128_reader"],
        },
      },
      (err) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
        } else {
          Quagga.start();
          Quagga.onDetected((result) => {
            const code128 = result.codeResult.code;
            // Handle the scanned barcode data (e.g., display it or send it to a server)
            // scannerContainer.innerText = code;
            setCode(code128);
            console.log("Scanned Barcode:", code128);
          });
        }
      }
    );
  }
  function stopBarcodeScanning() {
    setScanBarcode(false);
    try {
      Quagga.stop();
      Quagga.offDetected();
    } catch (error) {
      console.error("Error stopping Quagga:", error);
    }
  }

  return (
    <div>
      {/* this div is for the background */}
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
      <div>hello</div>
      <div id="scanner-container">code: {code}</div>
      <div className="modal-background">
        <div className="modal-container">
          <div className="close-btn">
            <button onClick={() => noChangeModal(false)}> X </button>
          </div>
          <div className="modal-header">
            <h2>Please enter product details</h2>
          </div>
          <div className="modal-body">
            {scanBarcode ? (
              <>
                <button onClick={stopBarcodeScanning}>Stop Scan</button>
                {/* Add an element to display the barcode scan results */}
              </>
            ) : (
              <button onClick={startBarcodeScanning}>Start Barcode Scan</button>
            )}

            <span>here will be the barcode value after scaning the value</span>
            <button onClick={() => setClick(!click)}>Click image</button>
            {click && (
              <div>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                />
                <button onClick={captureImage}>Capture Image</button>
                {capturedImage && (
                  <div>
                    <img src={capturedImage} alt="Captured" />
                    <button onClick={uploadImage}>Upload Image</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="modal-footer"></div>
        </div>
      </div>
    </div>
  );
}
