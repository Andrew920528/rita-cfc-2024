import {Session} from "./session";

// ID convention: classroom-YYMMDD-HHMMSS
export type Classroom = {
  id: string;
  name: string;
  subject: string;
  grade: string;
  publisher: string;
  sessions: number[];
  plan: boolean;
};

export type Classrooms = {
  dict: {[key: string]: Classroom};
  current: string;
};
