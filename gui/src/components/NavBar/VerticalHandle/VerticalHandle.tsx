import classNames from "classnames/bind";
import styles from "./VerticalHandle.module.scss";
import {useState} from "react";

const cx = classNames.bind(styles);

type Props = {
  unit: "percent" | "pixel";
  expandDirection?: "up" | "down";
  initHeight?: number;
  minHeight?: number;
  maxHeight?: number;

  onMouseDown?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e?: MouseEvent) => void;
};

const useVerticalHandle = ({
  unit,
  expandDirection = "down",
  initHeight = 50,
  minHeight = 0,
  maxHeight = 100,

  onMouseDown,
  onMouseUp,
  onMouseMove,
}: Props) => {
  const [mainHeight, setMainHeight] = useState<number>(initHeight);
  const [onPress, setOnPress] = useState<boolean>(false);
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const startY = e.clientY;
    const startHeight = mainHeight;
    document.body.style.cursor = "row-resize";
    setOnPress(true);
    onMouseDown && onMouseDown(e);
    const handleMouseMove = (e: MouseEvent) => {
      let deltaY;
      if (expandDirection === "up") {
        deltaY = startY - e.clientY; // up: +, down: -
      } else {
        deltaY = e.clientY - startY; // up: -, down: +
      }

      let newHeight;

      if (unit === "percent") {
        newHeight =
          (((startHeight / 100) * window.innerHeight + deltaY) /
            window.innerHeight) *
          100;
      } else {
        // pixel
        newHeight = startHeight + deltaY;
      }
      newHeight = Math.min(Math.max(minHeight, newHeight), maxHeight);
      setMainHeight(newHeight);
      onMouseMove && onMouseMove(e);
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setOnPress(false);
      document.body.style.cursor = "";
      onMouseUp && onMouseUp(e);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  function VerticalHandle({disabled = false}: {disabled?: boolean}) {
    return (
      <div
        onMouseDown={(e) => {
          if (disabled) {
            return;
          }
          handleMouseDown(e);
        }}
        className={cx("handle", {onPress, disabled})}
      />
    );
  }
  return {VerticalHandle, mainHeight, setMainHeight};
};

export default useVerticalHandle;
