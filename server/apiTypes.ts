/** Guide
For better formatting and the convinience of copy/ paste,
I decided to put API-related requirements here.

FIXME:Eventually, all these specifications and API docs should be
somewhere more official.
*/

// messageRita
type MessageRitaRequestFromGUI = {
  prompt: string;
  // widget is passed from gui
  // because they are not updated in db instantly
  widget: {
    id: string;
    type: number;
    content: JSON;
  };
  lectureId: string;
  classroomId: string;
};

type MessageRitaRequestServerToWatson = {
  prompt: string;
  widget: {
    id: string;
    type: number;
    content: JSON;
  };
  // use classroomId and lectureId
  // to query for actual data from db
  classroom: {
    name: string;
    subject: string;
    grade: string;
    publisher: string;
    credits: number;
  };
  lecture: {
    name: string;
    type: number;
  };
};

type MessageRitaResponse = {
  reply: string;
  // The 'extra' field is the content that will be parsed in the widget in gui
  extra: {
    widgetId: string;
    content: JSON;
  };
};
