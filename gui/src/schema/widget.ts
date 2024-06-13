export type Widget = {
  id: number;
  type: string;
};

export type Widgets = {
  dict: {[key: number]: Widget};
  current: number;
};
