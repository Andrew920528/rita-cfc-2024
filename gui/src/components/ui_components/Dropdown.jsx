import React, {useState} from "react";
import {ChevronDown, ChevronUp} from "@carbon/icons-react";

const UNDEFINED = "UNDEFINED";
const Dropdown = ({
  currId = UNDEFINED,
  setCurrId = () => {},
  idDict = {},
  getName = () => "name",
  placeholder = "placeholder",
  flex = false,
}) => {
  const [openMenu, setOpenMenu] = useState();

  return (
    <div
      className={`dropdown-wrapper ${flex ? "flex" : "fixed"}`}
      onClick={() => {
        setOpenMenu(!openMenu);
      }}
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
      )}
    </div>
  );
};

const DropdownOption = ({id, name, currId, onClick = () => {}}) => {
  return (
    <div
      className={`dropdown-option ${id === currId && "selected"}`}
      onClick={onClick}
    >
      <p>{name}</p>
    </div>
  );
};

export default Dropdown;
