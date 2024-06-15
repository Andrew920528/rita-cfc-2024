import React from "react";
import IconButton from "../ui_components/IconButton";
import {Alarm} from "@carbon/icons-react";
import {useAppDispatch} from "../../store/store";
import {WidgetsServices} from "../../features/WidgetsSlice";
import {SemesterGoalWidgetT, WidgetType} from "../../schema/widget";

type Props = {
  wid: string;
};
// TODO: Copies states into local states, and saves to global and db every once in a while
const SemesterGoalWidget = (props: Props) => {
  const dispatch = useAppDispatch();
  function editSemesterGoal() {
    const someNewContent = "abcdefg";
    const someNewWidget: SemesterGoalWidgetT = {
      id: "",
      type: WidgetType.SemesterGoal,
      content: someNewContent,
    };
    dispatch(
      WidgetsServices.actions.updateWidget({
        wid: props.wid,
        newWidget: someNewWidget,
      })
    );
  }
  return (
    <div>
      SemesterGoalWidget
      <IconButton
        icon={<Alarm size={20} />}
        mode="ghost"
        onClick={() => {
          editSemesterGoal();
        }}
      />
    </div>
  );
};

export default SemesterGoalWidget;
