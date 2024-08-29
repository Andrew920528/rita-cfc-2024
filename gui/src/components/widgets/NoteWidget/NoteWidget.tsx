import React, {useEffect} from "react";
import TextArea from "../../ui_components/TextArea/TextArea";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import {Widget, WidgetType} from "../../../schema/widget/widget";
import {NoteWidgetContent} from "../../../schema/widget/noteWidgetContent";
import classNames from "classnames/bind";
import styles from "./NoteWidget.module.scss";
import {Skeleton} from "@mui/material";
import {WidgetContentProps} from "../WidgetFrame/WidgetFrame";

const cx = classNames.bind(styles);

const NoteWidget = ({widget, loading, preview = false}: WidgetContentProps) => {
  const dispatch = useAppDispatch();
  function editNote(newNote: NoteWidgetContent) {
    const newWidget = {
      id: widget.id,
      type: WidgetType.Note,
      content: newNote,
    };
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: newWidget,
        mode: preview ? "preview" : "actual",
      })
    );
  }
  return !loading ? (
    <TextArea
      value={(widget.content as NoteWidgetContent).note}
      onChange={(e) => {
        let newNote = {note: e.currentTarget.value} as NoteWidgetContent;
        editNote(newNote);
      }}
    />
  ) : (
    <NoteSkeleton />
  );
};

const NoteSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      animation="wave"
      sx={{flexGrow: 1}}
    />
  );
};

export default NoteWidget;
