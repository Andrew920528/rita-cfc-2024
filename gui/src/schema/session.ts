import {Chatroom} from "./chatroom";
import {Widget} from "./widget";

export type Session = {
  id: string;
  name: string;
  type: number;
  widgets: number[]; // in order
  chatroom: number; // chatroom id
};

export type Sessions = {
  dict: {[key: string]: Sessions};
  current: string;
};
