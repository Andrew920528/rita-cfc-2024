import {Schedule} from "./schedule";
import {Classroom} from "./classroom";

export type User = {
  username: string;
  alias: string;
  school: string;
  occupation: string;
  schedule: Schedule;
  classrooms: number[]; // in order
};
