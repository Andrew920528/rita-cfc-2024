import {NoteWidgetMaker} from "./noteWidgetContent";
import {ScheduleWidgetMaker} from "./scheduleWidgetContent";
import {SemesterPlanWidgetMaker} from "./semesterPlanWidgetContent";
import {WidgetType, Widget} from "./widget";
import {SemesterGoalWidgetMaker} from "./semesterGoalWidgetContent";

const factory = {
  [WidgetType.SemesterGoal]: new SemesterGoalWidgetMaker(),
  [WidgetType.SemesterPlan]: new SemesterPlanWidgetMaker(),
  [WidgetType.Note]: new NoteWidgetMaker(),
  [WidgetType.Schedule]: new ScheduleWidgetMaker(),
};

export function initWidget(id: string, type: WidgetType): Widget {
  if (!(type in factory)) {
    return {
      id,
      type,
      content: {},
    };
  }
  let widget = {id, type, content: factory[type].init()};
  return widget;
}
// Defines UI related properties

export function widgetBook(type: WidgetType) {
  return factory[type].uiBook();
}

// Type guards
export function contentIsOfType(type: WidgetType, content: any) {
  if (!(type in factory)) {
    return false;
  }
  return factory[type].isType(content);
}
