import React, {useEffect} from "react";
import TextArea from "../../ui_components/TextArea/TextArea";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import {NoteWidgetContent, Widget, WidgetType} from "../../../schema/widget";
import classNames from "classnames/bind";
import styles from "./NoteWidget.module.scss";

const cx = classNames.bind(styles);
type Props = {
  wid: string;
};

const NoteWidget = (props: Props) => {
  const dispatch = useAppDispatch();
  const widget = useTypedSelector((state) => state.Widgets.dict[props.wid]);
  function editNote(newNote: NoteWidgetContent) {
    const newWidget: Widget = {
      id: props.wid,
      type: WidgetType.Note,
      content: newNote,
    };
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: newWidget,
      })
    );
  }
  return (
    <TextArea
      value={(widget.content as NoteWidgetContent).note}
      onChange={(e) => {
        let newNote = {note: e.currentTarget.value} as NoteWidgetContent;
        editNote(newNote);
      }}
    />
  );
};

export default NoteWidget;
