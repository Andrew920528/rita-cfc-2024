import classNames from "classnames/bind";
import styles from "./VerticalHandle.module.scss";
import {useState} from "react";

const cx = classNames.bind(styles);

type Props = {
  minHeight: number;
};

const useVerticalHandle = (props: Props) => {
  const [mainHeight, setMainHeight] = useState<number>(50);
  const [onPress, setOnPress] = useState<boolean>(false);
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = mainHeight;
    document.body.style.cursor = "row-resize";
    setOnPress(true);
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      console.log(deltaY);
      let newHeight =
        (((startHeight / 100) * window.innerHeight + deltaY) /
          window.innerHeight) *
        100;
      console.log(newHeight);
      newHeight = Math.min(Math.max(0, newHeight), 100);
      setMainHeight(newHeight);
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setOnPress(false);
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  function VerticalHandle() {
    return (
      <div
        onMouseDown={(e) => handleMouseDown(e)}
        className={cx("handle", {onPress})}
      />
    );
  }
  return {VerticalHandle, mainHeight, setMainHeight};
};

export default useVerticalHandle;
