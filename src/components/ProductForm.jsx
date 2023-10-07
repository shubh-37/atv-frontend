import { useRef } from "react";
import { useState } from "react";
import Webcam from "react-webcam";
import "../css/modal.css";
import Scanner from "./Scanner";
// eslint-disable-next-line react/prop-types
export default function ProductForm({ noChangeModal }) {
  const [camera, setCamera] = useState(false);
  const [result, setResult] = useState(null);

  const onDetected = (result) => {
    setResult(result);
  };
  const [click, setClick] = useState(false);
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
      <div className="modal-background">
        <div className="modal-container">
          <div className="close-btn">
            <button onClick={() => noChangeModal(false)}> X </button>
          </div>
          <div className="modal-header">
            <h2>Please enter product details</h2>
          </div>
          <div className="modal-body">
            <p>{result ? result : "Scanning..."}</p>
            <button onClick={() => setCamera(!camera)}>
              {camera ? "Stop" : "Start"}
            </button>
            <div className="container">
              {camera && <Scanner onDetected={onDetected} />}
            </div>
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
