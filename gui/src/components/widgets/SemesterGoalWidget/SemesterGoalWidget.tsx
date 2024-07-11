import React, {useEffect, useState} from "react";
import TextArea from "../../ui_components/TextArea/TextArea";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import {
  WidgetType,
  Widget,
  SemesterGoalWidgetContent,
} from "../../../schema/widget";
import {Skeleton} from "@mui/material";
import {useWidgetLoading} from "../../../features/UiSlice";

type Props = {
  wid: string;
};

const SemesterGoalWidget = (props: Props) => {
  const dispatch = useAppDispatch();
  const widget = useTypedSelector((state) => state.Widgets.dict[props.wid]);
  const [displayGoals, setDisplayGoals] = useState(
    (widget.content as SemesterGoalWidgetContent).goals.join("\n")
  );
  function editSemesterGoal(textAreaValue: string) {
    let goalList = textAreaValue.split("\n");
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
    setDisplayGoals(
      (widget.content as SemesterGoalWidgetContent).goals.join("\n")
    );
  }, [widget]);
  const loading = useWidgetLoading(props.wid);
  return !loading ? (
    <TextArea
      value={displayGoals}
      onChange={(e) => {
        editSemesterGoal(e.currentTarget.value);
        setDisplayGoals(e.currentTarget.value);
      }}
      placeholder="輸入本學期的學習重點，並用 enter 分隔不同項目"
    />
  ) : (
    <SemesterGoalSkeleton />
  );
};

const SemesterGoalSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      animation="wave"
      sx={{flexGrow: 1}}
    />
  );
};

export default SemesterGoalWidget;
