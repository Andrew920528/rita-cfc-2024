export const INDEPENDENT_MODE: boolean =
  import.meta.env.VITE_GUI_INDEPENDENT === "true" ? true : false;

export enum API {
  ERROR = "error",
  SUCCESS = "success",
  ABORTED = "aborted",
}

export const EMPTY_ID = "NONE";

export const WIDGET_MODIFIER_START_TOKEN = "WIDGET_MODIFIER_STARTED";
