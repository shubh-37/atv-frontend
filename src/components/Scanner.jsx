import { useEffect } from "react";
import Quagga from "quagga";

const Scanner = (props) => {
  // eslint-disable-next-line react/prop-types
  const { onDetected } = props;

  // const config = {
  //   inputStream: {
  //     name: "Live",
  //     type: "LiveStream",
  //     constraints: {
  //       width: { max: 300 },
  //       height: { max: 300 },
  //       facingMode: "environment",
  //       aspectRatio: { min: 1, max: 2 },
  //     },
  //   },
  //   locator: {
  //     patchSize: "medium",
  //     halfSample: true,
  //   },
  //   numOfWorkers: window.navigator.hardwareConcurrency,
  //   frequency: 10,
  //   decoder: {
  //     readers: ["code_93_reader"],
  //   },
  //   locate: true,
  // };

  useEffect(() => {
    var App = {
      _scanner: null,
      init: function() {
          this.attachListeners();
      },
      decode: function(src) {
          Quagga
              .decoder({readers: ['code_93_reader']})
              .locator({patchSize: 'medium'})
              .fromImage(src, {size: 800})
              .toPromise()
              .then(function(result) {
                  document.querySelector('input.isbn').value = result.codeResult.code;
              })
              .catch(function() {
                  document.querySelector('input.isbn').value = "Not Found";
              })
              .then(function() {
                  this.attachListeners();
              }.bind(this));
      },
      attachListeners: function() {
          var self = this,
              button = document.querySelector('.input-field input + .button.scan'),
              fileInput = document.querySelector('.input-field input[type=file]');
  
          button.addEventListener("click", function onClick(e) {
              e.preventDefault();
              button.removeEventListener("click", onClick);
              document.querySelector('.input-field input[type=file]').click();
          });
  
          fileInput.addEventListener("change", function onChange(e) {
              e.preventDefault();
              debugger;
              fileInput.removeEventListener("change", onChange);
              if (e.target.files && e.target.files.length) {
                  self.decode(URL.createObjectURL(e.target.files[0]));
              }
          });
      }
  };
  App.init();
  }, []);

  const detected = (result) => {
    onDetected(result.codeResult.code);
  };

  return (
    // If you do not specify a target,
    // QuaggaJS would look for an element that matches
    // the CSS selector #interactive.viewport
    <div id="interactive" className="viewport" />
   
  );
};

export default Scanner;
