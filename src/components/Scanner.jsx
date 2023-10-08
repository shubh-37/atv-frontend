import { useEffect } from "react";
import Quagga from "quagga";

const Scanner = (props) => {
  // eslint-disable-next-line react/prop-types
  const { onDetected } = props;

  const config = {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      constraints: {
        width: { max: 300 },
        height: { max: 300 },
        facingMode: "environment",
        aspectRatio: { min: 1, max: 2 },
      },
    },
    locator: {
      patchSize: "medium",
      halfSample: true,
    },
    numOfWorkers: window.navigator.hardwareConcurrency,
    frequency: 10,
    decoder: {
      readers: ["code_93_reader"],
    },
    locate: true,
  };

  useEffect(() => {
    Quagga.init(config, (err) => {
      if (err) {
        console.log(err, "error msg");
      }
      Quagga.start();
      return () => {
        Quagga.stop();
      };
    });
    console.log("inside useEff");
    //detecting boxes on stream
    Quagga.onProcessed((result) => {
      console.log("inside processing");
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            Number(drawingCanvas.getAttribute("width")),
            Number(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function (box) {
              return box !== result.box;
            })
            .forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });
    console.log("some");
    Quagga.onDetected(detected);
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
