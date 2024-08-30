import {AGENCY} from "../global/constants";
import {WidgetType} from "./widget/widget";

export type ChatMessage = {
  text: string;
  sender: string;
  completed: boolean;
};

export const SENDER = {
  system: "system",
  user: "user",
  ai: "ai",
};

export type Chatroom = {
  id: string;
  messages: ChatMessage[];
  agency: AGENCY;
};

export type Chatrooms = {
  dict: {[key: string]: Chatroom};
  waitingForReply: {[key: string]: boolean};
};

export function getAgencyByWidgetType(widgetType: WidgetType): AGENCY {
  if (widgetType === WidgetType.Worksheet) {
    return AGENCY.WORKSHEET;
  } else {
    return AGENCY.GENERAL;
  }
}
