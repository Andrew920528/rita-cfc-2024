import React, {ReactNode} from "react";

type Props = {
  headings: string[];
  content: {[key: string]: ReactNode}[];
};

type TableStyleProps = {};

const Table = (props: Props & TableStyleProps) => {
  return (
    <div className="table-container">
      <div className="table-header">
        {props.headings.map((h) => (
          <div key={h} className="table-header-item">
            {h}
          </div>
        ))}
      </div>
      <div className="table-body">
        {props.content.map((row, rowIndex) => (
          <div key={rowIndex} className="table-row">
            {props.headings.map((column, colIndex) => (
              <div
                key={"row" + rowIndex + "col" + column}
                className="table-row-item"
              >
                {row[column]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
