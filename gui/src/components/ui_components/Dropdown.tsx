import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {ChevronDown, ChevronUp, Close} from "@carbon/icons-react";

const UNDEFINED = "UNDEFINED";
type DropdownDict = {
  [key: string]: any;
};
type DropdownProps = {
  currId: string;
  setCurrId: (id: string) => void;
  idDict: DropdownDict;
  getName: (id: string) => string;
  placeholder: string;
  flex: boolean;
  action?: boolean;
  mode?: "on-dark" | "form";
  extra?: ReactNode;
  label?: string;
  errorMsg?: string;
};

const Dropdown = ({
  currId = UNDEFINED,
  setCurrId = () => {},
  idDict = {},
  getName = () => "name",
  placeholder = "placeholder",
  action = false,
  flex = false,
  extra = null,
  mode,
  errorMsg,
  label,
}: DropdownProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const componentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
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
      className={`dropdown-wrapper ${flex ? "flex" : "fixed"} ${mode}`}
      ref={componentRef}
    >
      {label && <p className="dd-label --label">{label}</p>}
      <div
        className={`dropdown ${mode} ${errorMsg ? "error" : ""}`}
        onClick={() => {
          setOpenMenu(!openMenu);
        }}
      >
        <p className={`value ${!(currId in idDict) ? "placeholder" : ""}`}>
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
        <div className={`dropdown-menu ${flex ? "flex" : "fixed"} ${mode}`}>
          <div className="dropdown-menu-main">
            {Object.keys(idDict).map((k) => (
              <DropdownOption
                key={k}
                id={k}
                name={getName(k)}
                currId={currId}
                onClick={() => {
                  setCurrId(k);
                  setOpenMenu(false);
                }}
                action={action}
              />
            ))}
          </div>
          {extra}
        </div>
      )}
      {errorMsg && <p className="dd-error --error --label">{errorMsg}</p>}
    </div>
  );
};

type DropdownOptionProps = {
  id: string | number;
  name: string;
  currId: string | number;
  onClick?: (args: any) => void;
  action: boolean;
  icon?: ReactNode;
  iconAction?: (e: React.MouseEvent<HTMLDivElement>) => void;
};
const DropdownOption = ({
  id,
  name,
  currId,
  onClick = () => {},
  action,
  icon = <Close />,
  iconAction = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    console.log("action icon clicked");
  },
}: DropdownOptionProps) => {
  return (
    <div
      className={`dropdown-option ${id === currId && "selected"}`}
      onClick={onClick}
    >
      <p>{name}</p>
      {action && (
        <div
          className={`dropdown-button ${id === currId && "selected"}`}
          onClick={(e) => {
            iconAction(e);
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
