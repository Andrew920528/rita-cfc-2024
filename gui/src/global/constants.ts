export const INDEPENDENT_MODE: boolean =
  import.meta.env.VITE_GUI_INDEPENDENT === "true" ? true : false;

export enum API {
  ERROR = "error",
  SUCCESS = "success",
  SESSION_EXPIRED = "session_expired",
  ABORTED = "aborted",
}

export const EMPTY_ID = "NONE";
