import {Session} from "./session";

export type Classroom = {
  id: number;
  name: string;
  subject: string;
  grade: string;
  publisher: string;
  sessions: number[];
};

export type Classrooms = {
  dict: {[key: number]: Classroom};
  current: number;
};
