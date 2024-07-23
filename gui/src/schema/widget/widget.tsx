import {SemesterGoalWidgetContent} from "./semesterGoalWidgetContent";
import {NoteWidgetContent} from "./noteWidgetContent";
import {SemesterPlanWidgetContent} from "./semesterPlanWidgetContent";
import {ScheduleWidgetContent} from "./scheduleWidgetContent";
import {ReactNode} from "react";
import {WorksheetWidgetContent} from "./worksheetWidgetContent";

/**
 * This file defines types and classes related to widgets
 * To add a new widget,
 * 1. Add the new widget type to the enum
 * 2. Define a content type (e.g. NoteWidgetContent).
 * 3. Define a maker class (e.g. NoteWidgetMaker).
 * 4. Union the content type with WidgetContent
 */
export enum WidgetType {
  SemesterGoal,
  SemesterPlan,
  Note,
  Schedule,
  Worksheet,
}

export type WidgetContent =
  | SemesterGoalWidgetContent
  | SemesterPlanWidgetContent
  | NoteWidgetContent
  | ScheduleWidgetContent
  | WorksheetWidgetContent;

// ========= Widget definitions =========
export type Widget = {
  id: string;
  type: WidgetType;
  content: WidgetContent;
};

export type Widgets = {
  dict: {[key: string]: Widget};
  current: string;
  unsaved: {[key: string]: true};
};
export type widgetUiBook = {
  title: string;
  hint: string;
  icon: ReactNode;
  type: WidgetType;
  width: number;
  minHeight: number;
  maxHeight: number;
};
export abstract class WidgetMaker<T> {
  abstract init(): T;
  abstract isType(obj: any): obj is T;
  abstract uiBook(): widgetUiBook;
}
