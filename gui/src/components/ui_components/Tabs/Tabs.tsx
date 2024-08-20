import React, {useState, ReactNode} from "react";
import classNames from "classnames/bind";
import styles from "./Tabs.module.scss";

const cx = classNames.bind(styles);
interface TabItem {
  title: string;
  content: ReactNode;
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
            onClick={() => handleTabClick(index)}
            className={cx("tab-header", activeIndex === index && "active")}
          >
            {item.title}
          </div>
        ))}
      </div>
      {items[activeIndex].content}
    </div>
  );
};

export default Tabs;
