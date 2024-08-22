export type Lecture = {
  id: string;
  name: string;
  type: number;
  widgetIds: string[]; // in order
};

export type Lectures = {
  dict: {[key: string]: Lecture};
  current: string;
  loading: {[key: string]: boolean};
};
