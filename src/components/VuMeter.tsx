import { useRef, useEffect, useCallback } from "react";
import invariant from "tiny-invariant";

// Settings
let curVal = 0;
const max = 100;
const boxCount = 20;
const boxCountRed = 5;
const boxCountYellow = 15;
const boxGapFraction = 0;

// Colors
const redOn = "hsla(330, 100%, 70%, 0.9)";
const redOff = "hsla(330, 100%, 70%, 0.5)";
const yellowOn = "hsla(330, 100%, 70%, 0.9)";
const yellowOff = "hsla(330, 100%, 70%, 0.5)";
const greenOn = "hsla(330, 100%, 70%, 0.9)";
const greenOff = "hsla(330, 100%, 70%, 0.5)";

type MeterProps = {
  width: number;
  height: number;
  meterValue: Float32Array;
};

function VuMeter({ meterValue, height, width }: MeterProps) {
  const stage = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef<number | null>(null);

  // Gap between boxes and box height
  const boxHeight = height / (boxCount + (boxCount + 1) * boxGapFraction);
  const boxGapY = boxHeight * boxGapFraction;

  const boxWidth = width - boxGapY * 2;
  const boxGapX = (width - boxWidth) / 2;

  // Get the color of a box given it's ID and the current value
  const getBoxColor = useCallback((id: number, val: number) => {
    if (id > boxCount - boxCountRed) {
      return id <= Math.ceil((val / max) * boxCount) ? redOn : redOff;
    }
    if (id > boxCount - boxCountRed - boxCountYellow) {
      return id <= Math.ceil((val / max) * boxCount) ? yellowOn : yellowOff;
    }
    return id <= Math.ceil((val / max) * boxCount) ? greenOn : greenOff;
  }, []);

  useEffect(() => {
    invariant(stage.current, "canvas not initiated");
    const c = stage.current.getContext("2d");
    if (c == null) throw new Error("Could not get context");
    c.fillStyle = "green";
    c.strokeStyle = "black";

    c.shadowBlur = 5;

    const draw = function () {
      invariant(stage.current, "canvas not initiated");
      const targetVal: string | undefined =
        stage.current.dataset.volume && stage.current.dataset.volume;

      invariant(targetVal, "target value not defined");
      const targetValNum: number = parseInt(targetVal, 10);

      // Gradual approach

      if (curVal <= targetValNum) {
        curVal += (targetValNum - curVal) / 5;
      } else {
        curVal -= (curVal - targetValNum) / 5;
      }

      // Draw the container
      c.save();
      c.beginPath();
      c.rect(0, 0, width, height);
      c.fillStyle = "rgb(12,22,32)";
      c.fill();
      c.restore();

      // Draw the boxes
      c.save();
      c.translate(boxGapX, boxGapY);
      for (let i = 0; i < boxCount; i++) {
        const id = Math.abs(i - (boxCount - 1)) + 1;

        c.beginPath();
        if (id <= Math.ceil((targetValNum / max) * boxCount)) {
          c.shadowBlur = 10;
          c.shadowColor = getBoxColor(id, targetValNum);
        }
        c.rect(0, 0, boxWidth, boxHeight);
        c.fillStyle = getBoxColor(id, targetValNum);
        c.fill();
        c.translate(0, boxHeight + boxGapY);
      }
      c.restore();
      drawRef.current = requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    return () => {
      drawRef.current !== null && cancelAnimationFrame(drawRef.current);
    };
  }, [width, height, boxHeight, boxGapY, boxGapX, getBoxColor, boxWidth]);

  useEffect(() => {
    invariant(stage.current, "canvas not initiated");
    stage.current.dataset.volume = meterValue.toString();
  }, [meterValue]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <canvas
        className="vu-meter"
        ref={stage}
        width={width}
        height={height}
        data-volume={0}
      />
    </div>
  );
}

export default VuMeter;
