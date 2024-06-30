import React, {useEffect, useState} from "react";
import TextArea from "../ui_components/TextArea/TextArea";
import {useAppDispatch, useTypedSelector} from "../../store/store";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {
  WidgetType,
  Widget,
  SemesterGoalWidgetContent,
} from "../../schema/widget";

type Props = {
  wid: string;
};

const SemesterGoalWidget = (props: Props) => {
  const dispatch = useAppDispatch();
  const [textAreaValue, setTextAreaValue] = useState("");
  function editSemesterGoal(textAreaValue: string) {
    let goalList = textAreaValue.split("\n").filter((x) => x !== "");
    let newSemesterGoal: SemesterGoalWidgetContent = {
      goals: goalList,
    };
    const newWidget: Widget = {
      id: props.wid,
      type: WidgetType.SemesterGoal,
      content: newSemesterGoal,
    };
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: newWidget,
      })
    );
  }

  useEffect(() => {
    editSemesterGoal(textAreaValue);
  }, [textAreaValue]);

  return (
    <TextArea
      value={textAreaValue}
      onChange={(e) => {
        setTextAreaValue(e.currentTarget.value);
      }}
      placeholder="輸入本學期的學習重點，並用 enter 分隔不同項目"
    />
  );
};

export default SemesterGoalWidget;
