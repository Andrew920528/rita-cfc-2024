export type ChatMessage = {
  text: string;
  sender: string;
  completed: boolean;
};

export const SENDER = {
  system: "system",
  user: "user",
  ai: "ai",
};

export type Chatroom = {
  id: string;
  messages: ChatMessage[];
}; // TODO: Also need to store a widgetPreview obj

export type Chatrooms = {
  dict: {[key: string]: Chatroom};
  waitingForReply: {[key: string]: boolean};
};
