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

type DropdownProps = {
  currId: string | number;
  setCurrId: Dispatch<SetStateAction<string | number>>;
  idDict: {[key: string | number]: object} | {};
  getName: (id: string | number) => string;
  placeholder: string;
  flex: boolean;
  extra: ReactNode;
};

const Dropdown = ({
  currId = UNDEFINED,
  setCurrId = () => {},
  idDict = {},
  getName = () => "name",
  placeholder = "placeholder",
  flex = false,
  extra = null,
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

type DropdownOptionProps = {
  id: string | number;
  name: string;
  currId: string | number;
  onClick?: (args: any) => void;
  icon?: ReactNode;
  iconAction?: (e: React.MouseEvent<HTMLDivElement>) => void;
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
}: DropdownOptionProps) => {
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
