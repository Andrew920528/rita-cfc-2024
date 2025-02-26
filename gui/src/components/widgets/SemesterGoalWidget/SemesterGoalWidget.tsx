import React, {useEffect, useState} from "react";
import TextArea from "../../ui_components/TextArea/TextArea";
import {useAppDispatch, useTypedSelector} from "../../../store/store";
import {WidgetsServices} from "../../../features/WidgetsSlice";
import {WidgetType, Widget} from "../../../schema/widget/widget";
import {SemesterGoalWidgetContent} from "../../../schema/widget/semesterGoalWidgetContent";
import {Skeleton, Tooltip} from "@mui/material";
import {WidgetContentProps} from "../WidgetFrame/WidgetFrame";
import Accordion from "../../ui_components/Accordion/Accordion";
import classNames from "classnames/bind";
import styles from "./SemesterGoalWidget.module.scss";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {
  Checkmark,
  CheckmarkOutline,
  Information,
  Plan,
  SubtractAlt,
} from "@carbon/icons-react";
import {parseDate} from "../../../utils/util";
import IconButton from "../../ui_components/IconButton/IconButton";
import SetSemesterPlanPU from "../../PopUps/SetSemesterPlanPU/SetSemesterPlanPU";
import {UiServices} from "../../../features/UiSlice";
import {TText} from "../../TText/TText";
import useLang from "../../../lang/useLang";

const cx = classNames.bind(styles);

const SemesterGoalWidget = ({
  widget,
  loading,
  preview = false,
}: WidgetContentProps) => {
  const dispatch = useAppDispatch();

  const [displayGoals, setDisplayGoals] = useState(
    (widget.content as SemesterGoalWidgetContent).goals.join("\n")
  );
  function editSemesterGoal(textAreaValue: string) {
    let goalList = textAreaValue.split("\n");
    let processedGoalList: string[] = [];
    for (let goal of goalList) {
      goal = goal.replace("- ", "");
      processedGoalList.push(goal);
    }

    let newSemesterGoal: SemesterGoalWidgetContent = {
      goals: processedGoalList,
    };
    const newWidget = {
      id: widget.id,
      type: WidgetType.SemesterGoal,
      content: newSemesterGoal,
    };
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: newWidget,
        mode: preview ? "preview" : "actual",
      })
    );
  }

  useEffect(() => {
    let displayString = "";
    for (let goal of (widget.content as SemesterGoalWidgetContent).goals) {
      displayString += (goal.length > 0 ? "- " : "") + goal + "\n";
    }
    displayString = displayString.replace(/\n$/, "");
    setDisplayGoals(displayString);
  }, [widget]);

  return !loading ? (
    <div className={cx("semester-goal-widget")}>
      <TextArea
        value={displayGoals}
        onChange={(e) => {
          editSemesterGoal(e.currentTarget.value);
          setDisplayGoals(e.currentTarget.value);
        }}
        placeholder="Enter this semester's key learning goals, and use enter ⏎ to separate different items."
      />

      <Accordion
        header={
          <div className={cx("as-header")}>
            <TText>Advanced Settings</TText>
          </div>
        }
        content={<SemesterGoalAdvancedSettings widgetId={widget.id} />}
        mode="no-border"
        initialOpen={false}
      />
    </div>
  ) : (
    <SemesterGoalSkeleton />
  );
};

const SemesterGoalAdvancedSettings = ({widgetId}: {widgetId: string}) => {
  const dispatch = useAppDispatch();
  function editSemesterGoalDate(startOrEnd: "start" | "end", date: string) {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    let newDate: string | undefined = undefined;
    if (!regex.test(date)) {
      console.log("Invalid date format. Expected MM-DD-YYYY but get" + date);
      newDate = undefined;
    } else {
      newDate = date;
    }
    console.log(`${newDate} is stored in widget`);
    let newSemesterGoal: SemesterGoalWidgetContent = {
      ...(widget.content as SemesterGoalWidgetContent),
      [startOrEnd]: newDate,
    };
    const newWidget = {
      id: widget.id,
      type: WidgetType.SemesterGoal,
      content: newSemesterGoal,
    };
    dispatch(
      WidgetsServices.actions.updateWidget({
        newWidget: newWidget,
        mode: "actual",
      })
    );
  }

  const widget = useTypedSelector((state: any) => state.Widgets.dict[widgetId]);
  const l = useLang();
  return (
    <div className={cx("semester-goal-advanced-settings")}>
      <div className={cx("setting-block")}>
        <span className={cx("setting-block-title")}>
          <p>
            <TText>Date</TText>
          </p>
          <Tooltip
            title={l("Course Plan Start And End Dates")}
            placement="right"
          >
            <Information />
          </Tooltip>
        </span>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className={cx("dates")}>
            <DatePicker
              label={l("Start Date")}
              onChange={(value) => {
                if (!value) return;
                let date: string = value.format("MM-DD-YYYY");
                editSemesterGoalDate("start", date); // stores string or undefined
              }}
              value={parseDate(
                (widget.content as SemesterGoalWidgetContent).start
              )} // value takes dayjs or null, null if given undefined value
            />
            --
            <DatePicker
              label={l("End Date")}
              onChange={(value) => {
                if (!value) return;
                let date = value.format("MM-DD-YYYY");
                editSemesterGoalDate("end", date);
              }}
              value={parseDate(
                (widget.content as SemesterGoalWidgetContent).end
              )}
            />
          </div>
        </LocalizationProvider>
      </div>
      <div className={cx("setting-block")}>
        <span className={cx("setting-block-title")}>
          <p>
            <TText>Corresponding Semester Plan</TText>
          </p>
          <Tooltip
            title={l("Rita This semester plan will be used to discuss with You.")}
            placement="right"
          >
            <Information />
          </Tooltip>
        </span>
        <span className={cx("setting-block-row")}>
          {(widget.content as SemesterGoalWidgetContent).semesterPlanRef ? (
            <div className={cx("set-plan-hint")}>
              <CheckmarkOutline />
              <TText>Configured</TText>
            </div>
          ) : (
            <div className={cx("set-plan-hint")}>
              <SubtractAlt />
              <TText>Not Set</TText>
            </div>
          )}
          <IconButton
            icon={<Plan />}
            text="Set Semester Plan"
            mode="primary"
            onClick={() =>
              dispatch(UiServices.actions.setOpenSetSemesterPlanPU(true))
            }
          />
        </span>
      </div>
    </div>
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
