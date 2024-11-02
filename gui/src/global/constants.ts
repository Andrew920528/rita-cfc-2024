export const INDEPENDENT_MODE: boolean =
  import.meta.env.VITE_GUI_INDEPENDENT === "true" ? true : false;

export const BASE_URL_DEV: string =
  import.meta.env.VITE_BACKEND_HOST || "http://localhost:3000";

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
