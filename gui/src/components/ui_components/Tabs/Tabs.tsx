import React, {useState, ReactNode} from "react";
import classNames from "classnames/bind";
import styles from "./Tabs.module.scss";
import {TText} from "../../TText/TText";

const cx = classNames.bind(styles);
interface TabItem {
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({items}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className={cx("tabs-wrapper")}>
      <div className={cx("tabs")}>
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (item.disabled) return;
              handleTabClick(index);
            }}
            className={cx("tab-header", {
              disabled: item.disabled,
              active: activeIndex === index,
            })}
            role="tab"
            aria-disabled={item.disabled}
          >
            <TText>{item.title}</TText>
          </div>
        ))}
      </div>
      {items[activeIndex].content}
    </div>
  );
};

export default Tabs;
