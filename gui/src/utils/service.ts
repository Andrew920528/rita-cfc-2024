import {useCallback, useEffect, useRef, useState} from "react";
import {formatTime, mimicApi} from "./util";
import {API_SUCCESS, API_ERROR, INDEPENDENT_MODE} from "../global/constants";

import {User} from "../schema/user";
import {Classroom} from "../schema/classroom";
import {Widget} from "../schema/widget";
import {Lecture} from "../schema/lecture";
import {dummyLoginData} from "./dummy";
type ResponseData = {
  status: typeof API_ERROR | typeof API_SUCCESS;
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
  apiFunction: (s: AbortSignal) => Promise<Response>;
  sideEffect?: (r: ResponseData) => ResponseData;
  debug?: boolean;
  identifier?: string;
}
interface ApiHandlerResult {
  apiHandler: ({
    apiFunction,
    sideEffect,
    debug,
    identifier,
  }: ApiHandlerArgs) => Promise<ResponseData>;
  loading: boolean;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  terminateResponse: () => void;
}
export const useApiHandler = (dependencies?: any[]): ApiHandlerResult => {
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  useEffect(
    () => {
      // Clean up the controller when the component unmounts
      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    },
    dependencies ? dependencies : []
  );
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
    }: ApiHandlerArgs) => {
      setLoading(true);
      if (abortControllerRef.current) {
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
        if (body.status === API_ERROR) throw new Error(body.data);

        if (debug) {
          console.log(
            `Response | ${identifier} | ${formatTime(new Date())}`,
            body
          );
        }
        return sideEffect(body);
      } catch (err) {
        let msg;
        if (err instanceof DOMException && err.name === "AbortError") {
          msg = "Request aborted";
          if (debug) console.warn(msg);
        } else if (err instanceof Error) {
          msg = err.message;
          if (debug) console.error(msg);
        } else {
          msg = "Unknown error";
          if (debug) console.error(msg);
        }

        const errorResponse: ResponseData = {status: "error", data: msg};
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
    abortControllerRef,
    terminateResponse,
  };
};

/**
 * Raw API calls that calls the backend
 * Documentation: https://docs.google.com/document/d/1EVmXDQIR49d-g57JczzRZ6wmxlWLhpY_Eczj9dUHrkk/edit
 */

const BASE_URL_DEV = "http://127.0.0.1:5000";
export function tryTrySee(abortSignal: AbortSignal) {
  const endPoint = "/hello";
  return fetch(BASE_URL_DEV + endPoint, {
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortSignal,
  });
}

// ✅ Can log in with newly created account
// ✅ Can log in with existing account
export function loginService(
  abortSignal: AbortSignal,
  payload: {username: string; password: string}
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API_SUCCESS,
      data: dummyLoginData,
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/login";
  return fetch(BASE_URL_DEV + endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload), // Convert data object to JSON string
    signal: abortSignal,
  });
}

// ✅ Can create account via signup gui
// 👀 Pass in placeholder values when first create user
export function createUserService(
  abortSignal: AbortSignal,
  payload: {
    username: string;
    password: string;
    school?: string;
    alias?: string;
    occupation?: string;
    schedule?: string;
  }
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API_SUCCESS,
      data: "User created",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/create-user";

  return fetch(BASE_URL_DEV + endPoint, {
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
  abortSignal: AbortSignal,
  payload: {
    username: string;
    alias?: string;
    school?: string;
    occupation?: string;
    schedule?: string;
  }
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API_SUCCESS,
      data: "user updated",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/update-user";
  return fetch(BASE_URL_DEV + endPoint, {
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
  abortSignal: AbortSignal,
  payload: {
    username: string;
    classroomId: string;
    classroomName: string;
    subject: string;
    publisher: string;
    grade: string;
    plan: boolean;
    chatroomId: string;
    credits: number;
  }
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API_SUCCESS,
      data: "classroom created",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/create-classroom";
  return fetch(BASE_URL_DEV + endPoint, {
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
  abortSignal: AbortSignal,
  payload: {
    classroomId: string;
    classroomName?: string;
    subject?: string;
    publisher?: string;
    grade?: string;
    plan?: boolean;
    credits?: number;
  }
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API_SUCCESS,
      data: "classroom updated",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/update-classroom";
  return fetch(BASE_URL_DEV + endPoint, {
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

// ✅ Can create lecture via header dropdown
export function createLectureService(
  abortSignal: AbortSignal,
  payload: {
    lectureId: string;
    classroomId: string;
    name: string;
    type: number;
  }
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API_SUCCESS,
      data: "lecture created",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/create-lecture";
  return fetch(BASE_URL_DEV + endPoint, {
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
  abortSignal: AbortSignal,
  payload: {
    lectureId: string;
    classroomId: string;
  }
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API_SUCCESS,
      data: "lecture deleted",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/delete-lecture";
  return fetch(BASE_URL_DEV + endPoint, {
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
// 👀 Semester plan widget cannot take null value (login not properly passed in)
// ✅ Content properly parsed in when refresh
export function createWidgetService(
  abortSignal: AbortSignal,
  payload: {
    widgetId: string;
    type: number;
    content: string; // stringify json
    lectureId: string;
  }
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API_SUCCESS,
      data: "widget created",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/create-widget";
  return fetch(BASE_URL_DEV + endPoint, {
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
// 👀 Havn't tested schedule
export function deleteWidgetService(
  abortSignal: AbortSignal,
  payload: {
    widgetId: string;
    lectureId: string;
  }
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API_SUCCESS,
      data: "widget deleted",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/delete-widget";
  return fetch(BASE_URL_DEV + endPoint, {
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
// 👀 Havn't tested schedule
export function updateWidgetBulkService(
  abortSignal: AbortSignal,
  payload: {
    widgetIds: string[];
    contents: string[]; // stringify json
  }
) {
  if (INDEPENDENT_MODE) {
    const response = {
      status: API_SUCCESS,
      data: "all widgets updated",
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }

  const endPoint = "/update-widget-bulk";
  return fetch(BASE_URL_DEV + endPoint, {
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

// 🤖
export function messageRitaService(
  abortSignal: AbortSignal,
  payload: {
    prompt: string;
    widget?: {
      id: string;
      type: number;
      content: string;
    };
    lectureId: string;
    classroomId: string;
  }
) {
  if (INDEPENDENT_MODE) {
    const ritaResponse = {
      text: "Hello, I'm Rita. You are in frontend development mode, where I am not connected to an actual AI",
      sender: "Rita",
    };
    const response = {
      status: API_SUCCESS,
      data: ritaResponse,
    };
    return mimicApi(100, JSON.parse(JSON.stringify(response)), abortSignal);
  }
  const endPoint = "/message-rita";
  return fetch(BASE_URL_DEV + endPoint, {
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

// TODO: if api all follow this format, consider refactor the functions
