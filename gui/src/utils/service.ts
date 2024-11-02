import {useCallback, useEffect, useRef, useState} from "react";
import {formatTime, mimicApi, mimicStreamApi} from "./util";
import {API, INDEPENDENT_MODE, BASE_URL} from "../global/constants";

import {dummyLoginData, dummyRitaResponse} from "./dummy";
import {Question} from "../schema/widget/worksheetWidgetContent";
type ResponseData = {
  status: API;
  data: any;
};

/** API Handler
 * A hook that does error handling and other utilities for an API call.
 * One "thread of process" can share the same handler. This means the
 * processes has shares terminating logic and has to run in syncrounoous order.
 * @param dependencies - If items in this array change, the hook will
 * terminate the current process.
 *
 * @returns {apiHandler, loading, terminateResponse}
 * apiHandler - The async function that can be called by the component with error handling
 * loading - Whether the API call is in progress
 * terminateResponse - A function that can be called to terminate the API call. Loading is set to false if called
 *
 * These are params that can be pased to apiHandler.
 * @param apiFunction - The async function that is called. The abort signal is used to cancel the call.
 * Returns the Response object (which is returned by the Fetch API).
 * @param sideEffect (optional) - The function that is called if the API call succeeds.
 * It performs calculation and modification to the response, such as parsing,
 * and returns an object that is suitable for the context.
 * Returns (and converts) the response data for typescript.
 * @param debug (optional) - Whether to log the API call
 * @param identifier (optional) - The identifier of the API call (for debugging)
 */
interface ApiHandlerArgs {
  apiFunction: (s?: AbortSignal) => Promise<Response>;
  sideEffect?: (r: ResponseData) => ResponseData;
  debug?: boolean;
  identifier?: string;
  allowAsync?: boolean;
}
interface ApiHandlerResult {
  apiHandler: ({
    apiFunction,
    sideEffect,
    debug,
    identifier,
    allowAsync,
  }: ApiHandlerArgs) => Promise<ResponseData>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  terminateResponse: () => void;
}
export const useApiHandler = ({
  dependencies = [],
  runsInBackground = false,
}: {
  dependencies?: any[];
  runsInBackground?: boolean;
} = {}): ApiHandlerResult => {
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  useEffect(() => {
    if (runsInBackground) return;
    // Clean up the controller when the component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);
  function terminateResponse() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  }
  const apiHandler = useCallback(
    async ({
      apiFunction,
      sideEffect = (r: ResponseData): ResponseData => r,
      debug = false,
      identifier = "",
      allowAsync = false,
    }: ApiHandlerArgs) => {
      setLoading(true);
      if (!allowAsync && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      try {
        if (debug) {
          console.log(`Request | ${identifier} | ${formatTime(new Date())}`);
        }
        let r = await apiFunction(signal);
        if (!r.ok) throw new Error("Server error" + r.statusText);

        let body: ResponseData = await r.json();
        if (body.status === API.ERROR) throw new Error(body.data);

        if (debug) {
          console.log(
            `Response | ${identifier} | ${formatTime(new Date())}`,
            body
          );
        }
        return sideEffect(body);
      } catch (err) {
        let msg;
        let stat;
        if (err instanceof DOMException && err.name === "AbortError") {
          msg = "Request aborted: " + identifier;
          stat = API.ABORTED;
          if (debug) console.warn(msg);
        } else if (err instanceof Error) {
          msg = err.message;
          stat = API.ERROR;
          if (debug) console.error(msg);
        } else {
          msg = "Unknown error";
          stat = API.ERROR;
          if (debug) console.error(msg);
        }

        const errorResponse: ResponseData = {status: stat, data: msg};
        return errorResponse;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, abortControllerRef]
  );
  return {
    apiHandler,
    loading,
    setLoading,
    abortControllerRef,
    terminateResponse,
  };
};

/**
 * Raw API calls that calls the backend
 * Documentation: https://docs.google.com/document/d/1EVmXDQIR49d-g57JczzRZ6wmxlWLhpY_Eczj9dUHrkk/edit
 */

export function tryTrySee(abortSignal?: AbortSignal) {
  const endPoint = "/hello";
  return fetch(BASE_URL + endPoint, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortSignal,
  });
}

// ✅ Can log in with newly created account
// ✅ Can log in with existing account
export function loginService(
  payload: {username: string; password: string},
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: dummyLoginData,
    };
    return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/login";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can log in when sessionId exists
export function loginWithSidService(
  payload: {sessionId: string},
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: dummyLoginData,
    };
    return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/login-with-sid";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can create account via signup gui
export function createUserService(
  payload: {
    username: string;
    password: string;
    school?: string;
    alias?: string;
    occupation?: string;
    schedule?: string;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "User created",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/create-user";

  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can update account via header (top right)
export function updateUserService(
  payload: {
    alias?: string;
    school?: string;
    occupation?: string;
    schedule?: string;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "user updated",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/update-user";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can create classroom via navbar
export function createClassroomService(
  payload: {
    classroomId: string;
    classroomName: string;
    subject: string;
    publisher: string;
    grade: string;
    plan: boolean;
    credits: number;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "classroom created",
    };
    return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/create-classroom";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can update classroom via header
export function updateClassroomService(
  payload: {
    classroomId: string;
    classroomName?: string;
    subject?: string;
    publisher?: string;
    grade?: string;
    plan?: boolean;
    credits?: number;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "classroom updated",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/update-classroom";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

export function deleteClassroomService(
  payload: {
    classroomId: string;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "classroom deleted",
    };
    return mimicApi(1000, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/delete-classroom";
  return fetch(BASE_URL + endPoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can create lecture via header dropdown
export function createLectureService(
  payload: {
    lectureId: string;
    classroomId: string;
    name: string;
    type: number;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: {
        chatroomId: "DUMMY_LEC_CHID",
        message: "Lecture created",
      },
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/create-lecture";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

export function updateLectureService(
  payload: {
    lectureId: string;
    name: string;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "lecture updated",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/update-lecture";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can delete lecture via header dropdown
export function deleteLectureService(
  payload: {
    lectureId: string;
    classroomId: string;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "lecture deleted",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/delete-lecture";
  return fetch(BASE_URL + endPoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can create note widget without issue
// ✅ Can create semester goal widget without issue
// ✅ Can create semester plan widget without issue
// ✅ Can create schedule widget without issue
// ✅ Content properly parsed in when refresh
export function createWidgetService(
  payload: {
    widgetId: string;
    type: number;
    content: string; // stringify json
    lectureId: string;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: {
        chatroomId: "DUMMY_WID_CHID",
        message: "Widget created",
      },
    };
    return mimicApi(2000, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/create-widget";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can delete widget via WidgetFrame
export function deleteWidgetService(
  payload: {
    widgetId: string;
    lectureId: string;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "widget deleted",
    };

    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/delete-widget";
  return fetch(BASE_URL + endPoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can update widgets properly
export function updateWidgetBulkService(
  payload: {
    widgetIds: string[];
    contents: string[]; // stringify json
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "all widgets updated",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/update-widget-bulk";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ can send and recieve message properly
export function messageRitaService(
  payload: {
    prompt: string;
    widget?: {
      id: string;
      type: number;
      content: string;
    };
    lectureId: string;
    classroomId: string;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const mimicResponse = dummyRitaResponse;
    return mimicStreamApi(50, mimicResponse, abortSignal);
  }
  const endPoint = "/message-rita";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}

export function setUpRitaService(abortSignal?: AbortSignal) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "Successfully initialized rita",
    };
    return mimicApi(1000, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/setup-rita";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
    signal: abortSignal,
  });
}

/// Worksheet APIs
export function getWordDocService(
  content: Question[],
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "Successfully retrieved word doc", // TODO: dummy word doc at front-end
    };
    return mimicApi(1000, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/send-word-doc";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}
export function getPdfService(content: Question[], abortSignal?: AbortSignal) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "You are running in independent mode, so no pdf will be sent.",
    };
    return mimicApi(1000, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/send-pdf";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}
export function translateService(
  payload: {
    text: string;
  },
  abortSignal?: AbortSignal
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API.SUCCESS,
      data: "翻譯後的中文字",
    };
    return mimicApi(1000, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/translate";
  return fetch(BASE_URL + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionStorage.getItem("sessionId"),
      ...payload,
    }), // Convert data object to JSON string
    signal: abortSignal,
  });
}
