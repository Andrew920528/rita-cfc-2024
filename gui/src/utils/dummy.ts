import {initSchedule} from "../schema/schedule";
import {
  FibQuestion,
  MatchQuestion,
  McQuestion,
  Question,
  QuestionType,
} from "../schema/widget/worksheetWidgetContent";

const dummyUser = {
  username: "dum-username",
  alias: "使用者B",
  school: "dum-school",
  occupation: "dum-occupation",
  schedule: JSON.stringify(initSchedule),
  classroomIds: [
    "AndrewHsu-classroom-m0c0kfxfeu4hrnlqu0m",
    "AndrewHsu-classroom-m0c2daalm8fervq92ue",
  ],
};

let classrooms = {
  dict: {
    "AndrewHsu-classroom-m0c0kfxfeu4hrnlqu0m": {
      credits: 3,
      grade: "五上",
      id: "AndrewHsu-classroom-m0c0kfxfeu4hrnlqu0m",
      lastOpenedSession: "Tue, 27 Aug 2024 05:56:00 GMT",
      lectureIds: [
        "AndrewHsu-lecture-0m0c0kfxfsk3mhsojb3p",
        "AndrewHsu-lecture-1m0c0kq17kpa68meaj2",
        "AndrewHsu-lecture-1m0c18bbzg2q5iwvbq2a",
      ],
      name: "502數學",
      plan: 0,
      publisher: "數學",
      subject: "數學",
      lastOpenedLecture: "AndrewHsu-lecture-0m0c0kfxfsk3mhsojb3p",
    },
    "AndrewHsu-classroom-m0c2daalm8fervq92ue": {
      credits: 5,
      grade: "五上",
      id: "AndrewHsu-classroom-m0c2daalm8fervq92ue",
      lastOpenedSession: "Tue, 27 Aug 2024 06:46:25 GMT",
      lectureIds: ["AndrewHsu-lecture-0m0c2daal853830ajriu"],
      name: "501 國文",
      plan: 0,
      publisher: "康軒",
      subject: "國文",
      lastOpenedLecture: "AndrewHsu-lecture-0m0c2daal853830ajriu",
    },
  },
  current: "AndrewHsu-classroom-m0c0kfxfeu4hrnlqu0m",
};
let lectures = {
  dict: {
    "AndrewHsu-lecture-0m0c0kfxfsk3mhsojb3p": {
      chatroomId: "jO8dpnhhG1O5vfuZ",
      id: "AndrewHsu-lecture-0m0c0kfxfsk3mhsojb3p",
      name: "學期規劃",
      type: 0,
      widgetIds: ["AndrewHsu-wid-m0c2evrs5n6ir1e01bk"],
    },
    "AndrewHsu-lecture-0m0c2daal853830ajriu": {
      chatroomId: "5hCxbwZaHrCvB8Tt",
      id: "AndrewHsu-lecture-0m0c2daal853830ajriu",
      name: "學期規劃",
      type: 0,
      widgetIds: [
        "AndrewHsu-wid-m0c2dwnzn0dt2pewiql",
        "AndrewHsu-wid-m0c2fkvbvkuoh1vnnep",
      ],
    },
    "AndrewHsu-lecture-1m0c0kq17kpa68meaj2": {
      chatroomId: "R6zlnDJKZcLSvpTn",
      id: "AndrewHsu-lecture-1m0c0kq17kpa68meaj2",
      name: "課1",
      type: 1,
      widgetIds: ["AndrewHsu-wid-m0c2eea3aw5e6nc1qjq"],
    },
    "AndrewHsu-lecture-1m0c18bbzg2q5iwvbq2a": {
      chatroomId: "R6X7NYkWWZtk7beJ",
      id: "AndrewHsu-lecture-1m0c18bbzg2q5iwvbq2a",
      name: "課2",
      type: 1,
      widgetIds: [],
    },
  },
  current: "AndrewHsu-lecture-0m0c0kfxfsk3mhsojb3p",
};
let widgets = {
  dict: {
    "AndrewHsu-wid-m0c2dwnzn0dt2pewiql": {
      chatroomId: "a85DoD1PNCwjnCBC",
      content: `{"goals": ["Learning Goal: Read"]}`,
      id: "AndrewHsu-wid-m0c2dwnzn0dt2pewiql",
      type: 0,
    },
    "AndrewHsu-wid-m0c2eea3aw5e6nc1qjq": {
      chatroomId: "z7V1ABwSdaoKHFTX",
      content: `{
        "note": "12, 1, 22, 90"
      }`,
      id: "AndrewHsu-wid-m0c2eea3aw5e6nc1qjq",
      type: 2,
    },
    "AndrewHsu-wid-m0c2evrs5n6ir1e01bk": {
      chatroomId: "QOizxxrFfrq7LaPL",
      content: `{
        "headings": ["週目", "課程單元", "活動"],
        "rows": [
          {
            "週目": "1",
            "課程單元": "a",
            "活動": ""
          }
        ]
      }`,
      id: "AndrewHsu-wid-m0c2evrs5n6ir1e01bk",
      type: 1,
    },
    "AndrewHsu-wid-m0c2fkvbvkuoh1vnnep": {
      chatroomId: "qeUVar7vfJTHb7f3",
      content: `{
        "questions": []
      }`,
      id: "AndrewHsu-wid-m0c2fkvbvkuoh1vnnep",
      type: 4,
    },
  },
  current: "AndrewHsu-wid-m0c2dwnzn0dt2pewiql",
  unsaved: {},
};
export const dummyLoginData: any = {
  sessionId: "ENCRYPTED STUFF",
  user: dummyUser,
  classroomsDict: classrooms.dict,
  lecturesDict: lectures.dict,
  widgetDict: widgets.dict,
};
export const dummyRitaResponse = [
  '{"agent": "Rita", "data": "**NOTE: This is in independent mode.**\\n\\n"}|T|',
  '{"agent": "Rita", "data": " H"}|T|',
  '{"agent": "Rita", "data": "i ther"}|T|',
  '{"agent": "Rita", "data": "e"}|T|',
  '{"agent": "Rita", "data": "! "}|T|',
  '{"agent": "Rita", "data": "I\'"}|T|',
  '{"agent": "Rita", "data": "m Rit"}|T|',
  '{"agent": "Rita", "data": "a"}|T|',
  '{"agent": "Rita", "data": ", you"}|T|',
  '{"agent": "Rita", "data": "r teachin"}|T|',
  '{"agent": "Rita", "data": "g assistan"}|T|',
  '{"agent": "Rita", "data": "t"}|T|',
  '{"agent": "Rita", "data": ". I"}|T|',
  '{"agent": "Rita", "data": "t seem"}|T|',
  '{"agent": "Rita", "data": "s lik"}|T|',
  '{"agent": "Rita", "data": "e yo"}|T|',
  '{"agent": "Rita", "data": "u\'r"}|T|',
  '{"agent": "Rita", "data": "e lookin"}|T|',
  '{"agent": "Rita", "data": "g a"}|T|',
  '{"agent": "Rita", "data": "t "}|T|',
  '{"agent": "Rita", "data": "a cours"}|T|',
  '{"agent": "Rita", "data": "e outlin"}|T|',
  '{"agent": "Rita", "data": "e fo"}|T|',
  '{"agent": "Rita", "data": "r mat"}|T|',
  '{"agent": "Rita", "data": "h lesson"}|T|',
  '{"agent": "Rita", "data": "s"}|T|',
  '{"agent": "Rita", "data": ". Whic"}|T|',
  '{"agent": "Rita", "data": "h specifi"}|T|',
  '{"agent": "Rita", "data": "c topi"}|T|',
  '{"agent": "Rita", "data": "c o"}|T|',
  '{"agent": "Rita", "data": "r lesso"}|T|',
  '{"agent": "Rita", "data": "n woul"}|T|',
  '{"agent": "Rita", "data": "d yo"}|T|',
  '{"agent": "Rita", "data": "u lik"}|T|',
  '{"agent": "Rita", "data": "e t"}|T|',
  '{"agent": "Rita", "data": "o pla"}|T|',
  '{"agent": "Rita", "data": "n"}|T|',
  '{"agent": "Rita", "data": "? O"}|T|',
  '{"agent": "Rita", "data": "r woul"}|T|',
  '{"agent": "Rita", "data": "d yo"}|T|',
  '{"agent": "Rita", "data": "u lik"}|T|',
  '{"agent": "Rita", "data": "e som"}|T|',
  '{"agent": "Rita", "data": "e genera"}|T|',
  '{"agent": "Rita", "data": "l suggestion"}|T|',
  '{"agent": "Rita", "data": "s o"}|T|',
  '{"agent": "Rita", "data": "n ho"}|T|',
  '{"agent": "Rita", "data": "w t"}|T|',
  '{"agent": "Rita", "data": "o structur"}|T|',
  '{"agent": "Rita", "data": "e "}|T|',
  '{"agent": "Rita", "data": "a lesso"}|T|',
  '{"agent": "Rita", "data": "n"}|T|',
  '{"agent": "Rita", "data": "?"}|T|',
  '{"agent": "Rita", "data": ""}|T|',
  '{"agent": "Widget Modifier", "data": "WIDGET_MODIFIER_STARTED"}|T|',
  `{"agent": "Widget Modifier", "data": "{\\"widgetId\\": \\"AndrewHsu-wid-m0c2dwnzn0dt2pewiql\\",\\"widgetContent\\": {\\"goals\\": [\\"你好\\"]}}"}|T|`,
];

export const dummyMcQuestion: Omit<McQuestion, "questionId"> = {
  question: "What is the capital of France?",
  type: QuestionType.MC,
  choices: ["Paris", "London", "Berlin", "Madrid"],
  answer: 0, // Index of the correct choice
};

export const dummyFibQuestion: Omit<FibQuestion, "questionId"> = {
  question: "The largest planet in our solar system is ____.",
  type: QuestionType.FIB,
  answer: ["Jupiter"], // Correct answer(s)
};

export const dummyMatchQuestion: Omit<MatchQuestion, "questionId"> = {
  question: "Match the countries with their capitals.",
  type: QuestionType.MATCH,
  leftList: ["France", "Germany", "Spain"],
  rightList: ["Paris", "Berlin", "Madrid"],
};
