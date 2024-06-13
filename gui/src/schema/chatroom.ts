export type Chatroom = {
  id: number;
};

export type Chatrooms = {
  dict: {[key: number]: Chatroom};
  current: number;
};
