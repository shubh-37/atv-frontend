import { useContext } from "react";
import { useRef } from "react";
import { useState } from "react";
import Webcam from "react-webcam";
import { productContext } from "../context/ProductContextProvider";
import "../css/modal.css";
import { nanoid } from "nanoid";

// eslint-disable-next-line react/prop-types
export default function ProductForm({ noChangeModal }) {
  
  const { barcode, createProduct } = useContext(productContext);
  const videoConstraints = {
    width: 300, // Set the desired width
    height: 320, // Set the desired height
    facingMode: "user", // You can specify 'user' for the front camera or 'environment' for the rear camera
  };
 
  const [click, setClick] = useState(false);
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const captureImage = () => {
    // image is base64 encoded
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const uploadImage = async () => {
    if (capturedImage) {
      const formData = new FormData();
      const fileName = `${nanoid()}.jpeg`;
      const blob = await (await fetch(capturedImage)).blob();
      console.log(blob);

      const file = new File([blob], fileName, {
        type: "image/jpeg",
        lastModified: new Date(),
      });
      console.log({ file });
      formData.append("image", file, fileName);
      formData.append("barcode", barcode);
      createProduct(formData);
    }
  };

  function categoryHandler(e) {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  }

  function createAndCloseModal() {}

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
            
            <button onClick={() => setClick(!click)}>
              {click ? "Close camera" : "Click image"}
            </button>
            {click && (
              <div>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  videoConstraints={videoConstraints}
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
            <select
              name="categoryOne"
              id=""
              onChange={(e) => categoryHandler(e)}
            >
              <option value="" disabled>
                Choose from category 1
              </option>
              <option value="Category1Value1">value1</option>
              <option value="Category1Value2">value2</option>
              <option value="Category1Value3">value3</option>
            </select>
            <select
              name="categoryTwo"
              id=""
              onChange={(e) => categoryHandler(e)}
            >
              <option value="" disabled>
                Choose from category 2
              </option>
              <option value="Category2Value1">value1</option>
              <option value="Category2Value2">value2</option>
              <option value="Category2Value3">value3</option>
            </select>
            <select
              name="categoryThree"
              id=""
              onChange={(e) => categoryHandler(e)}
            >
              <option value="" disabled>
                Choose from category 3
              </option>
              <option value="Category3Value1">value1</option>
              <option value="Category3Value2">value2</option>
              <option value="Category3Value3">value3</option>
            </select>
          </div>
          <div className="modal-footer">
            <button onClick={() => noChangeModal(false)} className="cancel-btn">
              Cancel
            </button>
            <button onClick={() => createAndCloseModal()}>
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
