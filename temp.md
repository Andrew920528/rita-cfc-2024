# Some temporary notes

Branch: ui-new-widget-api

1. Each lecture and each widgets both has a corresponding chatroom
   API to change (globalAction.ts, each place that used the following apis):

- login
  - classroom no longer holds chatroomId
  - lecture holds chatroomId
  - widgets holds chatroomId
