import React from "react";
import classNames from "classnames/bind";
import styles from "./EmbeddedChatroom.module.scss";
import Chatroom from "../../../Chatroom/Chatroom";
const cx = classNames.bind(styles);
type Props = {};

const EmbeddedChatroom = (props: Props) => {
  return (
    <div className={cx("embedded-chatroom")}>
      <Chatroom absolutePositioned={false} type="widget" />
    </div>
  );
};

export default EmbeddedChatroom;
