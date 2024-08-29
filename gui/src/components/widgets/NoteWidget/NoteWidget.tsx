import React, {useEffect} from "react";
import TextArea from "../../ui_components/TextArea/TextArea";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import {Widget, WidgetType} from "../../../schema/widget/widget";
import {NoteWidgetContent} from "../../../schema/widget/noteWidgetContent";
import classNames from "classnames/bind";
import styles from "./NoteWidget.module.scss";
import {Skeleton} from "@mui/material";

const cx = classNames.bind(styles);
type Props = {
  widget: Widget;
  loading: boolean;
};

const NoteWidget = ({widget, loading}: Props) => {
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
