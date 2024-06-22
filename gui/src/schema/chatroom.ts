export type ChatMessage = {
  text: string;
  sender: string;
};

export type Chatroom = {
  id: string;
  messages: ChatMessage[];
};

export type Chatrooms = {
  dict: {[key: string]: Chatroom};
  current: string;
};
