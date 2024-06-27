import React, {ReactNode, useEffect, useState} from "react";

type Props = {
  headings: string[];
  content: {[key: string]: ReactNode}[];
};

type TableStyleProps = {};

const Table = (props: Props & TableStyleProps) => {
  const [columnWidths, setColumnWidths] = useState(
    Array(props.headings.length).fill(2)
  );
  useEffect(() => {
    setColumnWidths(Array(props.headings.length).fill(2));
  }, [props.headings.length]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();

    const start = e.clientX;
    const sizes = columnWidths;

    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientX - start;
      const newSize = Math.max(20, sizes[index] + delta);

      const newWidths = [...columnWidths];
      newWidths[index] = newSize;
      newWidths[index + 1] = Math.max(20, sizes[index + 1] - delta);
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
        {props.headings.map((heading, index) => (
          <div
            key={heading}
            className="table-header-item"
            // style={{width: `${columnWidths[index]}px`}}
          >
            {heading}
            {/* {index < props.headings.length - 1 && (
              <div
                className="vertical-resize-handle"
                onMouseDown={(e) => handleMouseDown(e, index)}
              />
            )} */}
          </div>
        ))}
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
                  // style={{width: `${columnWidths[colIndex]}px`}}
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
