import {Chatroom} from "./chatroom";
import {Widget} from "./widget";

export type Session = {
  id: string;
  name: string;
  type: number;
  widgets: string[]; // in order
  chatroom: string; // chatroom id
};

export type Sessions = {
  dict: {[key: string]: Session};
  current: string;
};
