import React, {useEffect, useRef, useState} from "react";
import {ChevronDown, ChevronUp, Close} from "@carbon/icons-react";

const UNDEFINED = "UNDEFINED";
const Dropdown = ({
  currId = UNDEFINED,
  setCurrId = () => {},
  idDict = {},
  getName = () => "name",
  placeholder = "placeholder",
  flex = false,
  extra = null,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const componentRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      className={`dropdown-wrapper ${flex ? "flex" : "fixed"}`}
      onClick={() => {
        setOpenMenu(!openMenu);
      }}
      ref={componentRef}
    >
      <div className="dropdown">
        <p className={`value ${currId === UNDEFINED && "place-holder"}`}>
          {!(currId in idDict) ? placeholder : getName(currId)}
        </p>
        <div className="chevron">
          {openMenu ? (
            <ChevronUp size={20} width={20} />
          ) : (
            <ChevronDown size={20} width={20} />
          )}
        </div>
      </div>
      {openMenu && (
        <div className={`dropdown-menu ${flex ? "flex" : "fixed"}`}>
          <div className="dropdown-menu-main">
            {Object.keys(idDict).map((k) => (
              <DropdownOption
                key={k}
                id={k}
                name={getName(k)}
                currId={currId}
                onClick={() => {
                  setCurrId(k);
                }}
              />
            ))}
          </div>
          {extra}
        </div>
      )}
    </div>
  );
};

const DropdownOption = ({
  id,
  name,
  currId,
  onClick = () => {},
  icon = <Close />,
  iconAction = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    console.log("action icon clicked");
  },
}) => {
  return (
    <div
      className={`dropdown-option ${id === currId && "selected"}`}
      onClick={onClick}
    >
      <p>{name}</p>
      <div
        className={`dropdown-button ${id === currId && "selected"}`}
        onClick={(e) => {
          iconAction(e);
        }}
      >
        {icon}
      </div>
    </div>
  );
};

export default Dropdown;
