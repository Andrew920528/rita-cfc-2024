export type Widget = {
  id: number;
  type: string;
};

export type Widgets = {
  dict: {[key: string]: Widget};
  current: string;
};
