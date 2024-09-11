import React, {useEffect} from "react";
import classNames from "classnames/bind";
import styles from "./SetSemesterPlanPU.module.scss";
import PopUp, {PopUpProps} from "../PopUp/PopUp";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {WidgetType} from "../../../schema/widget/widget";
import {SemesterGoalWidgetContent} from "../../../schema/widget/semesterGoalWidgetContent";
import {SemesterPlanWidgetContent} from "../../../schema/widget/semesterPlanWidgetContent";
import WidgetFrame from "../../widgets/WidgetFrame/WidgetFrame";
import Table from "../../ui_components/Table/Table";
import {SemesterPlanReadOnly} from "../../widgets/SemesterPlanWidget/SemesterPlanWidget";
import {CheckmarkOutline} from "@carbon/icons-react";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import {UiServices} from "../../../features/UiSlice";
const cx = classNames.bind(styles);
type Props = {};

const SetSemesterPlanPU = (props: Props & PopUpProps) => {
  const classroom = useTypedSelector((state) => state.Classrooms);
  const lectures = useTypedSelector((state) => state.Lectures);
  const widgets = useTypedSelector((state) => state.Widgets);
  const currClassroom = classroom.dict[classroom.current];
  const [selectedLecture, setSelectedLecture] = React.useState<string>("");
  const [selectedPlan, setSelectedPlan] = React.useState<string>("");
  const dispatch = useAppDispatch();
  useEffect(() => {
    const currWidget = widgets.current;
    if (
      currWidget &&
      widgets.dict[currWidget].type === WidgetType.SemesterGoal
    ) {
      setSelectedLecture(lectures.current);
      setSelectedPlan(
        (widgets.dict[currWidget].content as SemesterGoalWidgetContent)
          .semesterPlanRef || ""
      );
    }
  }, []);

  if (!currClassroom) return <></>;
  return (
    <PopUp
      {...props}
      footerBtnProps={{
        icon: <CheckmarkOutline size={20} />,
        text: "選擇進度表",
        disabled: selectedPlan === "",
      }}
      puAction={() => {
        const currWidget = widgets.current;
        if (
          !widgets.dict[currWidget] ||
          widgets.dict[currWidget].type !== WidgetType.SemesterGoal
        ) {
          console.error(
            "Attempt to set semester plan for widget a none goal widget"
          );
          return;
        }
        console.log(selectedPlan);
        dispatch(
          WidgetsServices.actions.updateWidget({
            newWidget: {
              id: widgets.current,
              type: WidgetType.SemesterGoal,
              content: {
                ...widgets.dict[currWidget].content,
                semesterPlanRef: selectedPlan,
              },
            },
            mode: "actual",
          })
        );
        dispatch(UiServices.actions.setOpenSetSemesterPlanPU(false));
      }}
    >
      <div className={cx("content")}>
        <div className={cx("option-stack")}>
          <p className={cx("section-title")}>課程計畫</p>
          {currClassroom.lectureIds.map((id) => (
            <div
              className={cx("option-card", {selected: id === selectedLecture})}
              key={id}
              onClick={() => {
                setSelectedLecture(id);
                setSelectedPlan("");
              }}
            >
              <p>{lectures.dict[id].name}</p>
            </div>
          ))}
        </div>
        <div className={cx("option-stack")}>
          <p className={cx("section-title")}>進度表</p>
          {lectures.dict[selectedLecture] &&
            lectures.dict[selectedLecture].widgetIds.map((id) => {
              if (widgets.dict[id].type !== WidgetType.SemesterPlan) {
                return null;
              }
              const name =
                (widgets.dict[id].content as SemesterPlanWidgetContent).name ??
                "未命名的計畫";
              return (
                <div
                  className={cx("option-card", {
                    selected: id === selectedPlan,
                  })}
                  key={id}
                  onClick={() => {
                    setSelectedPlan(id);
                  }}
                >
                  {name}
                </div>
              );
            })}
        </div>
        <div className={cx("plan-preview")}>
          <p className={cx("section-title")}>預覽</p>
          {widgets.dict[selectedPlan] && (
            <div className={cx("plan-preview-content")}>
              <SemesterPlanReadOnly widget={widgets.dict[selectedPlan]} />
            </div>
          )}
        </div>
      </div>
    </PopUp>
  );
};

export default SetSemesterPlanPU;
