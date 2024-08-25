# Some temporary notes

Branch: ui-new-widget-api

1. Each lecture and each widgets both has a corresponding chatroom
   API to change (globalAction.ts, each place that used the following apis):

- login
  - classroom no longer holds chatroomId
  - lecture holds chatroomId
  - widgets holds chatroomId
- createClassroom
  - no longer creates a chatroom
- createLecture
  - automatically creates a chatroom
- createWidget
  - automarically creates a chatroom
- deleteWidget
  - also deletes chatroom
- deleteLecture
  - deletes all corresponding widgets and its chatroom
- deleteClassroom
  - no longer delete chatroom
- lecture schema
- classroom schema
- widget schema

2. deleteClassroom - service.ts
3. updateLecture - service.ts
