import React from "react";
import TextArea from "../ui_components/TextArea";

type Props = {
  wid: string;
};

const NoteWidget = (props: Props) => {
  return (
    <TextArea/>
  );
};

export default NoteWidget;
