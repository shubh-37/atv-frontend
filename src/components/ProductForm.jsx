import { useContext } from "react";
import { useRef } from "react";
import { useState } from "react";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import {
  BAD_REQUEST,
  CREATE_PRODUCT,
  NO_IMAGE,
  PRODUCT_FOUND,
  SUCCESS,
} from "../constants";
import { productContext } from "../context/ProductContextProvider";
import "../css/modal.css";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function ProductForm({ closeModal }) {
  const { createProduct, barcode, product, setProduct } =
    useContext(productContext);
  function notify(event, type) {
    event.preventDefault();
    if (type === CREATE_PRODUCT) {
      toast.success("Product created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (type === PRODUCT_FOUND) {
      toast.success("Product updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (type === NO_IMAGE) {
      toast.error("No image selected!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Error, Please try again after sometimes", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
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

  async function createAndCloseModal(e) {
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
      if (response === SUCCESS) {
        notify(e, CREATE_PRODUCT);
        setProduct({});
        closeModal(false);
        navigate("/");
      } else if (response === PRODUCT_FOUND) {
        notify(e, PRODUCT_FOUND);
        setProduct({});
        closeModal(false);
        navigate("/");
      } else {
        notify(e, BAD_REQUEST);
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
      if (response === SUCCESS) {
        notify(e, CREATE_PRODUCT);
        setProduct({});
        closeModal(false);
        navigate("/");
      } else if (response === PRODUCT_FOUND) {
        notify(e, PRODUCT_FOUND);
        setProduct({});
        closeModal(false);
        navigate("/");
      } else {
        notify(e, BAD_REQUEST);
      }
    } else {
      notify(e, NO_IMAGE);
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

                <button className="button2" onClick={captureImage}>
                  Capture Image
                </button>
              </div>
            )}
            {(product?.imageUrl ?? capturedImage) && (
              <div>
                <img src={product?.imageUrl ?? capturedImage} alt="Captured" />
                {/* <button onClick={uploadImage}>Upload Image</button> */}
              </div>
            )}
            <label htmlFor="craft">Craft category</label>
            <select
              className="input2"
              name="categoryOne"
              id="craft"
              onChange={(e) => categoryHandler(e)}
            >
              <option value="Choose from Craft category" disabled>
                Choose from Craft category
              </option>
              <option value="No value" defaultChecked>No value</option>
              <option value="Ajrakh">Ajrakh</option>
              <option value="Bandhni">Bandhni</option>
              <option value="Batik">Batik</option>
              <option value="Block Printed">Block Printed</option>
              <option value="Brocade">Brocade</option>
              <option value="Chikankari">Chikankari</option>
              <option value="Cutwork">Cutwork</option>
              <option value="Embroidered">Embroidered</option>
              <option value="Embroidery">Embroidery</option>
              <option value="Extra Weft Kadwa">Extra Weft Kadwa</option>
              <option value="Gota Patti">Gota Patti</option>
              <option value="Hand Paint">Hand Paint</option>
              <option value="Jamdani">Jamdani</option>
              <option value="Hand Painted">Hand Painted</option>
              <option value="Ikat">Ikat</option>
              <option value="Kadwa">Kadwa</option>
            </select>
            <label htmlFor="occasion">Occasion category</label>
            <select
              className="input2"
              name="categoryTwo"
              id="occasion"
              onChange={(e) => categoryHandler(e)}
            >
              <option value="" disabled>
                Choose from Occasion category
              </option>
              <option value="No value" defaultChecked>No value</option>
              <option value="Bridal Wear">Bridal Wear</option>
              <option value="Casual Wear">Casual Wear</option>
              <option value="Daily Wear">Daily Wear</option>
              <option value="Festive Wear">Festive Wear</option>
              <option value="Formal Wear">Formal Wear</option>
              <option value="Party Wear">Party Wear</option>
              <option value="Traditional Wear">Traditional Wear</option>
              <option value="Wedding Wear">Wedding Wear</option>
              <option value="Work Wear">Work Wear</option>
            </select>
            <label htmlFor="fabric">Fabric category</label>
            <select
              className="input2"
              name="categoryThree"
              id="fabric"
              onChange={(e) => categoryHandler(e)}
            >
              <option value="" disabled>
                Choose from Fabric category
              </option>
              <option value="No value" defaultChecked>No value</option>
              <option value="Chiffon">Chiffon</option>
              <option value="Cotton">Cotton</option>
              <option value="Cotton and Combination">Cotton and Combination</option>
              <option value="Crepe">Crepe</option>
              <option value="Eri">Eri</option>
              <option value="Georgette">Georgette</option>
            </select>
          </div>
          <div className="modal-footer">
            <button onClick={() => closeModal(false)} className="cancel-btn">
              Cancel
            </button>
            <button onClick={(e) => createAndCloseModal(e)}>
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
