// ID convention: classroom-YYMMDD-HHMMSS
export type Classroom = {
  id: string;
  name: string;
  subject: string;
  grade: string;
  publisher: string;
  lectureIds: string[];
  lastOpenedLecture?: string; // not saved in db
  plan: boolean;
  credits: number;
  chatroomId: string; // chatroom id
};

export type Classrooms = {
  dict: {[key: string]: Classroom};
  current: string;
};
