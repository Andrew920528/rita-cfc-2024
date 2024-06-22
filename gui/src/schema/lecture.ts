export type Lecture = {
  id: string;
  name: string;
  type: number;
  widgets: string[]; // in order
};

export type Lectures = {
  dict: {[key: string]: Lecture};
  current: string;
};
