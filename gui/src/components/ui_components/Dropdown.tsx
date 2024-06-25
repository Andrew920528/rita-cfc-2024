import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import {ChevronDown, ChevronUp, Close} from "@carbon/icons-react";
import IconButton from "./IconButton";

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
  action?: (id: string) => boolean;
  actionFunction?: (id: string) => void;
  actionDisabled?: (id: string) => boolean;
  mode?: "on-dark" | "form";
  extra?: ReactNode;
  label?: string;
  errorMsg?: string;
  actionIcon?: ReactNode;
};

const Dropdown = ({
  currId = UNDEFINED,
  setCurrId = () => {},
  idDict = {},
  getName = () => "name",
  placeholder = "placeholder",
  action = () => false,
  actionFunction = () => {},
  actionDisabled = () => false,
  actionIcon = <Close />,
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
                action={action(k)}
                actionFunction={actionFunction}
                icon={actionIcon}
                actionDisabled={actionDisabled(k)}
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
  id: string;
  name: string;
  currId: string;
  onClick?: (args: any) => void;
  action: boolean;
  icon?: ReactNode;
  actionFunction?: (id: string) => void;
  actionDisabled?: boolean;
};
const DropdownOption = ({
  id,
  name,
  currId,
  onClick = () => {},
  action,
  icon = <Close />,
  actionFunction = () => {},
  actionDisabled = false,
}: DropdownOptionProps) => {
  const handleIconClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e && e.stopPropagation) e.stopPropagation();
    actionFunction(id);
  };
  return (
    <div className={`dropdown-option ${id === currId && "selected"}`}>
      <div className="dropdown-option-left" onClick={onClick}>
        <p>{name}</p>
      </div>
      {action && (
        <IconButton
          mode={`dropdownBtn ${id === currId ? "selected" : ""}`}
          onClick={handleIconClick}
          icon={icon}
          disabled={actionDisabled}
        />
      )}
    </div>
  );
};

export default Dropdown;
