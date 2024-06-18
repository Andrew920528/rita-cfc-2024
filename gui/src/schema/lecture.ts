export type Lecture = {
  id: string;
  name: string;
  type: number;
  widgets: string[]; // in order
  chatroom: string; // chatroom id
};

export type Lectures = {
  dict: {[key: string]: Lecture};
  current: string;
};
