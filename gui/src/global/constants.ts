export const INDEPENDENT_MODE: boolean =
  import.meta.env.VITE_GUI_INDEPENDENT === "true" ? true : false;

export const BASE_URL: string =
  import.meta.env.VITE_BACKEND_HOST || "http://127.0.0.1:5000";

export enum API {
  ERROR = "error",
  SUCCESS = "success",
  ABORTED = "aborted",
}

export const EMPTY_ID = "NONE";

export const WIDGET_MODIFIER_START_TOKEN = "WIDGET_MODIFIER_STARTED";

export enum AGENCY {
  GENERAL,
  WORKSHEET,
  LECTURE,
}
