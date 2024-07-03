import React, {ReactNode, useEffect, useRef, useState} from "react";
import classNames from "classnames/bind";
import styles from "./Table.module.scss";

const cx = classNames.bind(styles);
type Props = {
  headings: string[];
  content: {[key: string]: ReactNode}[];
};

type TableStyleProps = {};

const Table = (props: Props & TableStyleProps) => {
  const [columnWidths, setColumnWidths] = useState(
    Array(props.headings.length).fill(80)
  );
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (columnWidths.length < props.headings.length) {
      let newWidths = [...columnWidths, 80];
      setColumnWidths(newWidths);
    }
  }, [props.headings.length]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();

    const start = e.clientX;
    const sizes = columnWidths;
    let totalSize = columnWidths[index] + columnWidths[index + 1];
    if (index + 1 === columnWidths.length - 1) {
      if (elementRef.current) {
        totalSize = columnWidths[index] + elementRef.current.offsetWidth;
      }
    }
    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientX - start;

      const newWidths = [...columnWidths];
      const newSize = Math.min(
        totalSize - 40,
        Math.max(40, sizes[index] + delta)
      );
      newWidths[index] = newSize;
      newWidths[index + 1] = totalSize - newSize;
      // if (index + 1 === columnWidths.length - 1) {
      //   newWidths[index + 1] = 80;
      // }
      setColumnWidths(newWidths);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  return (
    <div className={cx("table-container")}>
      <div className={cx("table-header")}>
        {props.headings.map((heading, index) =>
          index === props.headings.length - 1 ? (
            <div
              key={heading}
              className={cx("table-header-item")}
              ref={elementRef}
              style={{width: `${columnWidths[index]}px`}}
            >
              {heading}
            </div>
          ) : (
            <div
              key={heading}
              className={cx("table-header-item")}
              style={{width: `${columnWidths[index]}px`}}
            >
              {heading}
              <div
                className={cx("vertical-resize-handle")}
                onMouseDown={(e) => handleMouseDown(e, index)}
              />
            </div>
          )
        )}
      </div>
      <div className={cx("table-body")}>
        <div
          className={cx("row-controller")}
          onMouseEnter={() => {
            // console.log("enter");
          }}
          onMouseLeave={() => {
            // console.log("leave");
          }}
        ></div>
        {props.content.map((row, rowIndex) => (
          <div className={cx("row-wrapper")} key={rowIndex}>
            {/* FIXME row index shouldn't be key */}
            <div className={cx("table-row")}>
              {props.headings.map((column, colIndex) => (
                <div
                  key={"row" + rowIndex + "col" + column}
                  className={cx("table-row-item")}
                  style={{width: `${columnWidths[colIndex]}px`}}
                >
                  {row[column]}
                </div>
              ))}
            </div>
            <div
              className={cx("row-controller")}
              onMouseEnter={() => {
                // console.log("enter");
              }}
              onMouseLeave={() => {
                // console.log("leave");
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
