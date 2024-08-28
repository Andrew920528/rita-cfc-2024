import React from "react";
import classNames from "classnames/bind";
import styles from "./EmbeddedChatroom.module.scss";
import Chatroom from "../../../Chatroom/Chatroom";
import {useTypedSelector} from "../../../../store/store";
import {EMPTY_ID} from "../../../../global/constants";
const cx = classNames.bind(styles);
type Props = {};

const EmbeddedChatroom = (props: Props) => {
  const widgets = useTypedSelector((state) => state.Widgets);
  return (
    <div className={cx("embedded-chatroom")}>
      <Chatroom
        absolutePositioned={false}
        type="widget"
        chatroomId={
          widgets.dict[widgets.current]
            ? widgets.dict[widgets.current].chatroomId
            : EMPTY_ID
        }
      />
    </div>
  );
};

export default EmbeddedChatroom;
