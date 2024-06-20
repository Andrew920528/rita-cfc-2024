import React from "react";
import TextArea from "../ui_components/TextArea";
import {useAppDispatch} from "../../store/store";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {NoteWidgetT, WidgetType} from "../../schema/widget";
type Props = {
  wid: string;
};

const NoteWidget = (props: Props) => {
  const dispatch = useAppDispatch();
  function editNote() {
    const newNote = "newNote";
    const SnewWidget: NoteWidgetT = {
      id: "",
      type: WidgetType.Note,
      content: newNote,
    };
    dispatch(
      WidgetsServices.actions.updateWidget({
        wid: props.wid,
        newWidget: SnewWidget

      })
    )
  }
  return (
    <TextArea/>
  );
};

export default NoteWidget;
