import {LoginResponseObject} from "./service";

const dummyUser = {
  username: "dum-username",
  token: "ENCRYPTED STUFF",
  alias: "使用者B",
  school: "dum-school",
  occupation: "dum-occupation",
  schedule: Array(8).fill({
    mon: "",
    tue: "",
    wed: "",
    thu: "",
    fri: "",
  }),
  classroomIds: [
    "dum-username-classroom-lxu4e0arlztbh3snv7d",
    "dum-username-classroom-lxu4ehnp9fs1h0utd99",
  ],
};

let classrooms = {
  dict: {
    "dum-username-classroom-lxu4e0arlztbh3snv7d": {
      id: "dum-username-classroom-lxu4e0arlztbh3snv7d",
      name: "502數學",
      subject: "數學",
      grade: "五上",
      publisher: "康軒",
      lectureIds: [
        "dum-username-lecture-0lxu4e0arrfasuz2nqkr",
        "dum-username-lecture-1lxu4fmhmbdlc2qmwws",
        "dum-username-lecture-1lxu4fvybzy672umsmu",
      ],
      plan: false,
      credits: 3,
      chatroom: "dum-username-chatroom-lxu4e0ar5bk5nztua7",
    },
    "dum-username-classroom-lxu4ehnp9fs1h0utd99": {
      id: "dum-username-classroom-lxu4ehnp9fs1h0utd99",
      name: "601 藝文",
      subject: "藝文",
      grade: "六上",
      publisher: "綜合",
      lectureIds: [
        "dum-username-lecture-0lxu4ehnpe0uoaf3zevw",
        "dum-username-lecture-1lxu4f8m4q6noyg5746",
        "dum-username-lecture-1lxu4g6rppit5sp56eu",
      ],
      plan: false,
      credits: 3,
      chatroom: "dum-username-chatroom-lxu4ehnpjhxo7es2c3r",
    },
  },
  current: "dum-username-classroom-lxu4ehnp9fs1h0utd99",
};
let lectures = {
  dict: {
    "dum-username-lecture-0lxu4e0arrfasuz2nqkr": {
      id: "dum-username-lecture-0lxu4e0arrfasuz2nqkr",
      name: "學期規劃",
      type: 0,
      widgetIds: [],
    },
    "dum-username-lecture-0lxu4ehnpe0uoaf3zevw": {
      id: "dum-username-lecture-0lxu4ehnpe0uoaf3zevw",
      name: "學期規劃",
      type: 0,
      widgetIds: [
        "dum-username-wid-lxu4el0kwcyyfcov1vq",
        "dum-username-wid-lxu4elg2lfnarfers8",
        "dum-username-wid-lxu4em4t3ljnn4ddb3r",
      ],
    },
    "dum-username-lecture-1lxu4f8m4q6noyg5746": {
      id: "dum-username-lecture-1lxu4f8m4q6noyg5746",
      name: "課程一",
      type: 1,
      widgetIds: [
        "dum-username-wid-lxu4fakw3fckulw2l1b",
        "dum-username-wid-lxu4fbgulel7u60vjol",
      ],
    },
    "dum-username-lecture-1lxu4fmhmbdlc2qmwws": {
      id: "dum-username-lecture-1lxu4fmhmbdlc2qmwws",
      name: "第一張",
      type: 1,
      widgetIds: [
        "dum-username-wid-lxu4fne0habpt5sqpks",
        "dum-username-wid-lxu4fo90t6q5nmg4wxs",
        "dum-username-wid-lxu4fomft5jcfmifz3c",
        "dum-username-wid-lxu4fpoexzcylwyebkr",
      ],
    },
    "dum-username-lecture-1lxu4fvybzy672umsmu": {
      id: "dum-username-lecture-1lxu4fvybzy672umsmu",
      name: "第二張",
      type: 1,
      widgetIds: [],
    },
    "dum-username-lecture-1lxu4g6rppit5sp56eu": {
      id: "dum-username-lecture-1lxu4g6rppit5sp56eu",
      name: "課程二",
      type: 1,
      widgetIds: ["dum-username-wid-lxu4g9fh5ayjtgihsqo"],
    },
  },
  current: "dum-username-lecture-1lxu4g6rppit5sp56eu",
};
let widgets = {
  dict: {
    "dum-username-wid-lxu4el0kwcyyfcov1vq": {
      id: "dum-username-wid-lxu4el0kwcyyfcov1vq",
      type: 0,
      content: {goals: []},
    },
    "dum-username-wid-lxu4elg2lfnarfers8": {
      id: "dum-username-wid-lxu4elg2lfnarfers8",
      type: 1,
      content: {
        headings: ["週目", "目標", "教材"],
        rows: [{週目: "1", 目標: "畢卡索", 教材: "漢字ドリル第1章"}],
      },
    },
    "dum-username-wid-lxu4em4t3ljnn4ddb3r": {
      id: "dum-username-wid-lxu4em4t3ljnn4ddb3r",
      type: 2,
      content: {note: "你好呀"},
    },
    "dum-username-wid-lxu4fakw3fckulw2l1b": {
      id: "dum-username-wid-lxu4fakw3fckulw2l1b",
      type: 2,
      content: {note: ""},
    },
    "dum-username-wid-lxu4fbgulel7u60vjol": {
      id: "dum-username-wid-lxu4fbgulel7u60vjol",
      type: 1,
      content: {
        headings: ["週目", "目標", "教材"],
        rows: [
          {週目: "1", 目標: "基本的な漢字の習得", 教材: "漢字ドリル第1章"},
        ],
      },
    },
    "dum-username-wid-lxu4fne0habpt5sqpks": {
      id: "dum-username-wid-lxu4fne0habpt5sqpks",
      type: 0,
      content: {goals: []},
    },
    "dum-username-wid-lxu4fo90t6q5nmg4wxs": {
      id: "dum-username-wid-lxu4fo90t6q5nmg4wxs",
      type: 1,
      content: {
        headings: ["週目", "目標", "教材"],
        rows: [
          {週目: "1", 目標: "基本的な漢字の習得", 教材: "漢字ドリル第1章"},
        ],
      },
    },
    "dum-username-wid-lxu4fomft5jcfmifz3c": {
      id: "dum-username-wid-lxu4fomft5jcfmifz3c",
      type: 2,
      content: {note: ""},
    },
    "dum-username-wid-lxu4fpoexzcylwyebkr": {
      id: "dum-username-wid-lxu4fpoexzcylwyebkr",
      type: 3,
      content: {},
    },
    "dum-username-wid-lxu4g9fh5ayjtgihsqo": {
      id: "dum-username-wid-lxu4g9fh5ayjtgihsqo",
      type: 1,
      content: {
        headings: ["週目", "目標", "教材"],
        rows: [
          {週目: "1", 目標: "基本的な漢字の習得", 教材: "漢字ドリル第1章"},
        ],
      },
    },
  },
  current: "dum-username-wid-lxu4g9fh5ayjtgihsqo",
  unsaved: {},
};

let chatrooms = {
  "dum-username-chatroom-lxu4e0ar5bk5nztua7": {
    id: "dum-username-chatroom-lxu4e0ar5bk5nztua7",
    messages: [],
  },
  "dum-username-chatroom-lxu4ehnpjhxo7es2c3r": {
    id: "dum-username-chatroom-lxu4ehnpjhxo7es2c3r",
    messages: [],
  },
};

export const dummyLoginData: LoginResponseObject = {
  token: "ENCRYPTED STUFF",
  user: dummyUser,
  classroomsDict: classrooms.dict,
  lecturesDict: lectures.dict,
  widgetDict: widgets.dict,
};
