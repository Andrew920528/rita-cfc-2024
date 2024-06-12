import {Chatroom} from "./chatroom";
import {Widget} from "./widget";

export type Session = {
  id: number;
  name: string;
  type: number;
  widgets: Widget[];
  chatroom: Chatroom;
};
