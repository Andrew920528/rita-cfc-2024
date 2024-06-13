export type Chatroom = {
  id: string;
};

export type Chatrooms = {
  dict: {[key: string]: Chatroom};
  current: string;
};
