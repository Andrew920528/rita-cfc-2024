import {Schedule} from "./schedule";
import {Classroom} from "./classroom";

export type User = {
  username: string;
  token: string; // for verification
  alias: string;
  school: string;
  occupation: string;
  schedule: Schedule;
  classrooms: string[]; // in order
  scheduleChanged?: boolean; // not saved in db
};
