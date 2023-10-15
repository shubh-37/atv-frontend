import { useContext } from "react";
import { useRef } from "react";
import { useState } from "react";
import Webcam from "react-webcam";
import { productContext } from "../context/ProductContextProvider";
import "../css/modal.css";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function ProductForm({ closeModal, closeBarcodeModal }) {
  const { createProduct, barcode, product, setProduct } =
    useContext(productContext);
  console.log({ product });
  const videoConstraints = {
    width: 250, // Set the desired width
    height: 250, // Set the desired height
    facingMode: "environment", // You can specify 'user' for the front camera or 'environment' for the rear camera
  };
  const [click, setClick] = useState(false);
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const navigate = useNavigate();
  const captureImage = () => {
    // image is base64 encoded
    setProduct({ ...product, imageUrl: undefined });
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };
  function categoryHandler(e) {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value ?? product[e.target.name],
    });
  }

  async function createAndCloseModal() {
    if (capturedImage) {
      const formData = new FormData();
      const fileName = `${nanoid()}.jpeg`;
      const blob = await (await fetch(capturedImage)).blob();

      const file = new File([blob], fileName, {
        type: "image/jpeg",
        lastModified: new Date(),
      });
      formData.append("image", file, fileName);
      formData.append(
        "categoryOne",
        categoryData.categoryOne
          ? categoryData.categoryOne
          : product?.categoryOne
      );
      formData.append(
        "categoryTwo",
        categoryData.categoryTwo
          ? categoryData.categoryTwo
          : product?.categoryTwo
      );
      formData.append(
        "categoryThree",
        categoryData.categoryThree
          ? categoryData.categoryThree
          : product?.categoryThree
      );
      formData.append("barcode", barcode);

      const response = await createProduct(formData);
      if (response) {
        console.log("send toast");
        closeModal(false);
        navigate("/");
      }
    } else if (product.imageUrl.length > 0) {
      const formData = new FormData();
      formData.append("imageUrl", product.imageUrl);
      formData.append(
        "categoryOne",
        categoryData.categoryOne
          ? categoryData.categoryOne
          : product?.categoryOne
      );
      formData.append(
        "categoryTwo",
        categoryData.categoryTwo
          ? categoryData.categoryTwo
          : product?.categoryTwo
      );
      formData.append(
        "categoryThree",
        categoryData.categoryThree
          ? categoryData.categoryThree
          : product?.categoryThree
      );
      formData.append("barcode", barcode);
      const response = await createProduct(formData);
      if (response) {
        console.log("send toast");
        setProduct({});
        closeModal(false);
        navigate("/");
      } else {
        console.log("send toast");
      }
    } else {
      console.log("send error toast");
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
      <div className="modal-background">
        <div className="modal-container">
          <div className="close-btn">
            <button onClick={() => closeModal(false)}> X </button>
          </div>
          <div className="modal-header">
            <h2>Please enter product details</h2>
          </div>
          <div className="modal-body">
            <h4>Barcode: {barcode}</h4>
            <button className="button1" onClick={() => setClick(!click)}>
              {click ? "Close camera" : "Open camera"}
            </button>
            {click && (
              <div>
                <div className="webcam">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    videoConstraints={videoConstraints}
                    screenshotFormat="image/jpeg"
                  />
                </div>

                <button className="button2" onClick={captureImage}>Capture Image</button>
              </div>
            )}
            {(product?.imageUrl ?? capturedImage) && (
              <div>
                <img src={product?.imageUrl ?? capturedImage} alt="Captured" />
                {/* <button onClick={uploadImage}>Upload Image</button> */}
              </div>
            )}
            <label htmlFor="cat1">Category 1</label>
            <select
            className="input2"
              name="categoryOne"
              id="cat1"
              onChange={(e) => categoryHandler(e)}
            >
              <option value="Choose from category 1" disabled>
                Choose from category 1
              </option>
              <option value="Category1Value1">value1</option>
              <option value="Category1Value2">value2</option>
              <option value="Category1Value3">value3</option>
            </select>
            <label htmlFor="cat2">Category 2</label>
            <select
            className="input2"
              name="categoryTwo"
              id="cat2"
              onChange={(e) => categoryHandler(e)}
            >
              <option value="" disabled>
                Choose from category 2
              </option>
              <option value="Category2Value1">value1</option>
              <option value="Category2Value2">value2</option>
              <option value="Category2Value3">value3</option>
            </select>
            <label htmlFor="cat3">Category 2</label>
            <select
            className="input2"
              name="categoryThree"
              id="cat3"
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
            <button onClick={() => closeModal(false)} className="cancel-btn">
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
