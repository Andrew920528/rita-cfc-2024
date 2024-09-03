import classNames from "classnames/bind";
import styles from "./IdeatingDots.module.scss";
const cx = classNames.bind(styles);
export const IdeatingDots = () => {
  return (
    <div className={cx("ideating-dots")}>
      <div className={cx("ideating-dot")} />
      <div className={cx("ideating-dot")} />
      <div className={cx("ideating-dot")} />
    </div>
  );
};
