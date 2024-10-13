import React, {ReactNode, useEffect, useRef, useState} from "react";
import classNames from "classnames/bind";
import styles from "./Table.module.scss";
import {FloatingMenuButton} from "../FloatingMenu/FloatingMenu";
import IconButton from "../IconButton/IconButton";
import {
  CheckmarkOutline,
  ColumnDelete,
  ColumnInsert,
  Edit,
  OverflowMenuVertical,
  RowDelete,
  RowInsert,
} from "@carbon/icons-react";
import {Menu, MenuItem} from "@mui/material";
import {generateId} from "../../../utils/util";
import Textbox from "../Textbox/Textbox";

const cx = classNames.bind(styles);
type Props = {
  headings: string[];
  content: {[key: string]: ReactNode}[];
  readonly?: boolean;
  // actions
  insertColumn?: (index: number) => void;
  deleteColumn?: (index: number) => void;
  insertRow?: (index: number) => void;
  deleteRow?: (index: number) => void;
  editColumn?: (index: number, newName: string) => void;
};

type TableStyleProps = {};
const initColWidth = 200;
const minWidth = 80;
const Table = ({
  headings,
  content,
  readonly = false,
  insertColumn,
  deleteColumn,
  insertRow,
  deleteRow,
  editColumn,
}: Props & TableStyleProps) => {
  const [columnWidths, setColumnWidths] = useState(
    Array(headings.length).fill(initColWidth)
  );
  useEffect(() => {
    if (columnWidths.length < headings.length) {
      let newWidths = [...columnWidths, initColWidth];
      setColumnWidths(newWidths);
    }
  }, [headings.length]);

  const handleHorizontalDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    const start = e.clientX;
    const handleMouseMove = (event: MouseEvent) => {
      const delta = event.clientX - start;

      const newWidths = [...columnWidths];
      const newSize = Math.max(minWidth, columnWidths[index] + delta);
      newWidths[index] = newSize;
      setColumnWidths(newWidths);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const [anchorColEl, setAnchorColEl] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorRowEl, setAnchorRowEl] = React.useState<null | HTMLElement>(
    null
  );

  const headingIdRefs = useRef(headings.map(() => generateId()));
  const rowIdRefs = useRef(content.map(() => generateId()));

  const openCol = Boolean(anchorColEl);
  const openRow = Boolean(anchorRowEl);

  const [selectedColIndex, setSelectedColIndex] = useState(-1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

  const [editHeading, setEditHeading] = useState<boolean[]>(
    headings.map(() => false)
  );
  const editingValue = useRef<string>("");
  const [editingError, setEditingError] = useState("");

  const handleClickMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: "col" | "row",
    colIndex: number,
    rowIndex: number
  ) => {
    if (type === "col") {
      setSelectedColIndex(colIndex);
      setAnchorColEl(event.currentTarget);
    }
    if (type === "row") {
      setSelectedRowIndex(rowIndex);
      setAnchorRowEl(event.currentTarget);
    }
  };
  const handleCloseMenu = () => {
    setAnchorColEl(null);
    setAnchorRowEl(null);
  };

  const handleEditColumn = (index: number) => {
    if (!editColumn) return;
    // editColumn(index);

    for (let i = 0; i < editHeading.length; i++) {
      if (editHeading[i]) {
        confirmEditColumn(i, editingValue.current);
        editHeading[i] = false;
      }
    }

    let newEditHeading = [...editHeading];
    newEditHeading[index] = true;
    setEditHeading(newEditHeading);
    editingValue.current = headings[index];

    handleCloseMenu();
  };

  const confirmEditColumn = (index: number, newName: string) => {
    if (!editColumn) return;
    for (let i = 0; i < headings.length; i++) {
      if (headings[i] === newName && i !== index) {
        setEditingError("欄位名稱重複");
        return;
      }
    }
    setEditingError("");
    editColumn(index, newName);
    let newEditHeading = [...editHeading];
    newEditHeading[index] = false;
    setEditHeading(newEditHeading);
    editingValue.current = "";
  };

  const handleDeleteColumn = (index: number) => {
    if (!deleteColumn) return;
    deleteColumn(index);
    headingIdRefs.current.splice(index, 1);
    handleCloseMenu();
  };

  const handleInsertColumn = (index: number) => {
    if (!insertColumn) return;
    insertColumn(index);
    headingIdRefs.current.splice(index, 0, generateId());
    handleCloseMenu();
  };

  const handleDeleteRow = (index: number) => {
    if (!deleteRow) return;
    deleteRow(index);
    rowIdRefs.current.splice(index, 1);
    handleCloseMenu();
  };

  const handleInsertRow = (index: number) => {
    if (!insertRow) return;
    insertRow(index);
    rowIdRefs.current.splice(index, 0, generateId());
    handleCloseMenu();
  };

  const ColumnActionMenu = ({index}: {index: number}) => {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorColEl}
        open={openCol}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            handleEditColumn(index);
          }}
        >
          <div className={cx("menu-action-item")}>
            <Edit />
            編輯欄位
          </div>
        </MenuItem>
        <MenuItem onClick={() => handleInsertColumn(index + 1)}>
          <div className={cx("menu-action-item")}>
            <ColumnInsert />
            向右插入欄位
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteColumn(index)}
          disabled={headings.length === 1}
        >
          <div className={cx("menu-action-item", "danger")}>
            <ColumnDelete />
            刪除此欄位
          </div>
        </MenuItem>
      </Menu>
    );
  };

  const RowActionMenu = ({index}: {index: number}) => {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorRowEl}
        open={openRow}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={() => handleInsertRow(index + 1)}>
          <div className={cx("menu-action-item")}>
            <RowInsert />
            向下插入列
          </div>
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteRow(index)}
          disabled={content.length === 1}
        >
          <div className={cx("menu-action-item", "danger")}>
            <RowDelete />
            刪除此列
          </div>
        </MenuItem>
      </Menu>
    );
  };

  return (
    <div className={cx("table-container")}>
      <div className={cx("table-header")}>
        {headings.map((heading, index) => (
          <div
            key={headingIdRefs.current[index]}
            className={cx("table-header-item")}
            style={{width: `${columnWidths[index]}px`}}
          >
            {editHeading[index] ? (
              <Textbox
                defaultValue={heading}
                onChange={(e) => {
                  editingValue.current = e.target.value;
                }}
                errorMsg={editingError}
                mode="table"
              />
            ) : (
              <p>{heading}</p>
            )}

            {!readonly &&
              (editHeading[index] ? (
                <IconButton
                  icon={<CheckmarkOutline />}
                  onClick={() => {
                    confirmEditColumn(index, editingValue.current);
                  }}
                  mode="ghost"
                />
              ) : (
                <div className={cx("action-dots")}>
                  <IconButton
                    icon={<OverflowMenuVertical />}
                    onClick={(e) => {
                      handleClickMenu(
                        e as React.MouseEvent<HTMLButtonElement>,
                        "col",
                        index,
                        -1
                      );
                    }}
                    mode="ghost"
                  />
                </div>
              ))}
            <div
              className={cx("vertical-resize-handle")}
              onMouseDown={(e) => handleHorizontalDrag(e, index)}
            />
          </div>
        ))}
        <ColumnActionMenu index={selectedColIndex} />
      </div>
      <div className={cx("table-body")}>
        <div
          className={cx("row-controller")}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
        ></div>
        {content.map((row, rowIndex) => (
          <div className={cx("row-wrapper")} key={rowIdRefs.current[rowIndex]}>
            <div className={cx("table-row")}>
              {headings.map((column, colIndex) => (
                <div
                  key={
                    rowIdRefs.current[rowIndex] +
                    headingIdRefs.current[colIndex]
                  }
                  className={cx("table-row-item")}
                  style={{width: `${columnWidths[colIndex]}px`}}
                >
                  {row[column]}
                </div>
              ))}
              {!readonly && (
                <div
                  className={cx("table-row-item", "action-col")}
                  style={{width: `3rem`}}
                >
                  <div className={cx("action-dots")}>
                    <IconButton
                      icon={<OverflowMenuVertical />}
                      onClick={(e) => {
                        handleClickMenu(
                          e as React.MouseEvent<HTMLButtonElement>,
                          "row",
                          -1,
                          rowIndex
                        );
                      }}
                      mode="ghost"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <RowActionMenu index={selectedRowIndex} />
      </div>
    </div>
  );
};

export default Table;
