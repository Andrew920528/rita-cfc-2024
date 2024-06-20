import React from "react";
import TextArea from "../ui_components/TextArea";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {NoteWidgetT, WidgetType} from "../../schema/widget";
type Props = {
  wid: string;
};

const NoteWidget = (props: Props) => {
  const dispatch = useAppDispatch();
  const widget = useTypedSelector((state) => state.Widgets.dict[props.wid]);
  function editNote(newNote: string) {
    const SnewWidget: NoteWidgetT = {
      id: "",
      type: WidgetType.Note,
      content: newNote,
    };
    dispatch(
      WidgetsServices.actions.updateWidget({
        wid: props.wid,
        newWidget: SnewWidget,
      })
    );
  }
  return (
    <TextArea
      onChange={(e) => {
        editNote(e.currentTarget.value);
      }}
    />
  );
};

export default NoteWidget;
