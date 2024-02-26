import { useContext } from 'react';
import { toast } from 'react-toastify';
import { AUTH_FAILED, BAD_REQUEST, CREATE_PRODUCT, NOT_FOUND, NO_BARCODE, PRODUCT_FOUND, SUCCESS } from '../constants';
import { productContext } from '../context/ProductContextProvider';
import FileBarcodeDecoder from './FileUpload';
import '../css/modal.css';
import { authContext } from '../context/AuthContextProvider';

// eslint-disable-next-line react/prop-types
export default function BarcodeModal({ closeModal, openProductForm }) {
  const { searchBarcode, barcode, setBarcode } = useContext(productContext);
  const { logoutUser } = useContext(authContext);

  function notify(event, type) {
    event.preventDefault();
    if (type === CREATE_PRODUCT) {
      toast.info('Please create NEW product!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (type === PRODUCT_FOUND) {
      toast.success('Product details found successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (type === NO_BARCODE) {
      toast.error('Please enter barcode to continue', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (type === AUTH_FAILED) {
      toast.error('Authentication failed. Please login again', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else {
      toast.error('Error, Please try again after sometimes', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  }
  async function searchHandler(e) {
    if (barcode === 'No barcode available' || barcode === 'No barcode found in the image.') {
      notify(e, NO_BARCODE);
    } else {
      const response = await searchBarcode(barcode);
      if (response === SUCCESS) {
        notify(e, PRODUCT_FOUND);
        closeModal(false);
        openProductForm(true);
      } else if (response === NOT_FOUND) {
        notify(e, CREATE_PRODUCT);
        closeModal(false);
        openProductForm(true);
      } else if (response === AUTH_FAILED) {
        notify(e, AUTH_FAILED);
        closeModal(false);
        logoutUser();
      } else {
        notify(e, BAD_REQUEST);
      }
    }
  }
  return (
    <>
      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: '0',
          left: '0',
          opacity: '0.5',
          backgroundColor: 'grey'
        }}
      ></div>
      <div className="modal-background">
        <div className="modal-container">
          <div className="close-btn">
            <button
              onClick={() => {
                closeModal(false);
                setBarcode('No barcode available');
              }}
            >
              {' '}
              X{' '}
            </button>
          </div>
          <div className="modal-header">
            <h2>Upload/Type Barcode</h2>
          </div>
          <div className="modal-body">
            <p>Enter barcode manually</p>
            <span>
              <input
                className="input1"
                placeholder="type barcode"
                type="text"
                name=""
                id=""
                onChange={(e) => setBarcode(e.target.value)}
              />
              <button className="button3" onClick={(e) => searchHandler(e)}>
                Upload
              </button>
            </span>
            <h3>OR</h3>
            <FileBarcodeDecoder />
          </div>
          <div className="modal-footer">
            <button
              onClick={() => {
                closeModal(false);
                setBarcode('No barcode available');
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button onClick={(e) => searchHandler(e)}>Upload Barcode</button>
          </div>
        </div>
      </div>
    </>
  );
}
