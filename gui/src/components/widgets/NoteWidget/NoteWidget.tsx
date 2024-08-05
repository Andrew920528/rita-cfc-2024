import React, {useEffect} from "react";
import TextArea from "../../ui_components/TextArea/TextArea";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import {Widget, WidgetType} from "../../../schema/widget/widget";
import {NoteWidgetContent} from "../../../schema/widget/noteWidgetContent";
import classNames from "classnames/bind";
import styles from "./NoteWidget.module.scss";
import {Skeleton} from "@mui/material";
import {useWidgetLoading} from "../../../features/UiSlice";

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
  const loading = useWidgetLoading(props.wid);
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
