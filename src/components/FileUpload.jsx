import { useRef, useEffect } from 'react';
import { useContext } from 'react';
import { productContext } from '../context/ProductContextProvider';

const FileBarcodeDecoder = () => {
  const { barcode, setBarcode } = useContext(productContext);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!('BarcodeDetector' in globalThis)) {
      alert('Barcode Detector is not supported by this browser.');
    } else {
      // eslint-disable-next-line no-undef
      const barcodeDetector = new BarcodeDetector({
        formats: ['code_93']
      });
      const videoElement = videoRef.current;

      const startCamera = async () => {
        try {
          // Get user media for the video stream
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: {
                exact: 'environment'
              }
            }
          });
          videoElement.srcObject = stream;
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      };

      // Add an event listener for when the component mounts
      startCamera();

      // Create a canvas element to draw video frames onto
      const canvasElement = document.createElement('canvas');

      // Get the 2D context of the canvas
      const canvasContext = canvasElement.getContext('2d');

      // Continuously capture frames from the video and perform barcode detection
      const captureFrame = async () => {
        canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        // Perform barcode detection on the current frame
        try {
          const barcodes = await barcodeDetector.detect(canvasElement);

          if (barcodes.length > 0) {
            // Handle detected barcodes here
            setBarcode(barcodes[0].rawValue);
          }
        } catch (error) {
          console.error('Barcode detection error:', error);
        }

        // Request the next frame
        requestAnimationFrame(captureFrame);
      };

      // Add an event listener for when the video is loaded and ready
      videoElement.addEventListener('loadedmetadata', () => {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        captureFrame();
      });
    }
  }, []);

  return (
    <div className="modal-body">
      <div>
        <video ref={videoRef} autoPlay playsInline muted width="540" height="300"></video>
        <div>Decoded Barcode: {barcode}</div>
      </div>
    </div>
  );
};

export default FileBarcodeDecoder;
