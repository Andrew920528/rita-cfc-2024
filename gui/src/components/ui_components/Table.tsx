import React, {ReactNode, useEffect, useRef, useState} from "react";

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
      console.log("first");
      if (elementRef.current) {
        console.log(elementRef.current.offsetWidth);
        totalSize = columnWidths[index] + elementRef.current.offsetWidth;
      }
    }
    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientX - start;

      const newWidths = [...columnWidths];

      console.log(index);
      console.log(newWidths);
      console.log(newWidths.length);

      const newSize = Math.min(
        totalSize - 20,
        Math.max(20, sizes[index] + delta)
      );
      newWidths[index] = newSize;
      newWidths[index + 1] = totalSize - newSize;
      if (index + 1 === columnWidths.length - 1) {
        newWidths[index + 1] = 80;
      }
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
    <div className="table-container">
      <div className="table-header">
        {props.headings.map((heading, index) =>
          index === props.headings.length - 1 ? (
            <div
              key={heading}
              className="table-header-item"
              ref={elementRef}
              style={{width: `${columnWidths[index]}px`}}
            >
              {heading}
            </div>
          ) : (
            <div
              key={heading}
              className="table-header-item"
              style={{width: `${columnWidths[index]}px`}}
            >
              {heading}
              <div
                className="vertical-resize-handle"
                onMouseDown={(e) => handleMouseDown(e, index)}
              />
            </div>
          )
        )}
      </div>
      <div className="table-body">
        <div
          className="row-controller"
          onMouseEnter={() => {
            console.log("enter");
          }}
          onMouseLeave={() => {
            console.log("leave");
          }}
        ></div>
        {props.content.map((row, rowIndex) => (
          <div className="row-wrapper" key={rowIndex}>
            {/* FIXME row index shouldn't be key */}
            <div className="table-row">
              {props.headings.map((column, colIndex) => (
                <div
                  key={"row" + rowIndex + "col" + column}
                  className="table-row-item"
                  style={{width: `${columnWidths[colIndex]}px`}}
                >
                  {row[column]}
                </div>
              ))}
            </div>
            <div
              className="row-controller"
              onMouseEnter={() => {
                console.log("enter");
              }}
              onMouseLeave={() => {
                console.log("leave");
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
