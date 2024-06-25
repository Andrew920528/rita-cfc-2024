import {useCallback, useEffect, useRef, useState} from "react";
import {formatTime, mimicApi} from "./util";
import {API_SUCCESS, API_ERROR, dummyLoginData} from "./constants";
import {User} from "../schema/user";
import {Classroom} from "../schema/classroom";
import {Widget} from "../schema/widget";
import {Lecture} from "../schema/lecture";

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
        } else if (err instanceof Error) {
          msg = err.message;
        } else {
          msg = "Unknown error";
        }
        if (debug) console.warn(msg);
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
 */

const BASE_URL_DEV = "http://127.0.0.1:5000";
export function tryTrySee(abortSignal: AbortSignal) {
  return fetch(BASE_URL_DEV + "/hello", {
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortSignal,
  });
}

// 😍 = actually calls api
// 🤖 = api called in component
// 🤡 = function implemented with dymmy data

// 🤖
export type LoginResponseObject = {
  token?: string; // TODO should be required
  user: User;
  classroomsDict: {[cid: string]: Classroom};
  lecturesDict: {[lid: string]: Lecture};
  widgetDict: {[wid: string]: Widget};
};
export function loginService(
  abortSignal: AbortSignal,
  payload: {username: string; password: string}
) {
  const response = {
    status: API_SUCCESS,
    data: dummyLoginData,
  };
  return mimicApi(2000, JSON.parse(JSON.stringify(response)), abortSignal);
}

// 🤡
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
  const response = {
    status: API_SUCCESS,
    data: "account created",
  };
  return mimicApi(2000, JSON.parse(JSON.stringify(response)), abortSignal);
}

// 🤖
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
  const response = {
    status: API_SUCCESS,
    data: "user updated",
  };
  return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
}

// 🤖
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
  const response = {
    status: API_SUCCESS,
    data: "classroom created",
  };
  return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
}

// 🤖
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
  const response = {
    status: API_SUCCESS,
    data: "classroom updated",
  };
  return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
}

// 🤖
export function createLectureService(
  abortSignal: AbortSignal,
  payload: {
    lectureId: string;
    classroomId: string;
    name: string;
    type: number;
  }
) {
  const response = {
    status: API_SUCCESS,
    data: "lecture created",
  };
  return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
}

// 🤖
export function deleteLectureService(
  abortSignal: AbortSignal,
  payload: {
    lectureId: string;
    classroomId: string;
  }
) {
  const response = {
    status: API_SUCCESS,
    data: "lecture deleted",
  };
  return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
}

// 🤖
export function createWidgetService(
  abortSignal: AbortSignal,
  payload: {
    widgetId: string;
    type: number;
    content: string; // stringify json
    lectureId: string;
  }
) {
  const response = {
    status: API_SUCCESS,
    data: "widget created",
  };
  return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
}

// 🤖
export function deleteWidgetService(
  abortSignal: AbortSignal,
  payload: {
    widgetId: string;
    lectureId: string;
  }
) {
  const response = {
    status: API_SUCCESS,
    data: "widget deleted",
  };
  return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
}

// 🤖 * Currently unused
export function updateWidgetService(
  abortSignal: AbortSignal,
  payload: {
    widgetId: string;
    content: string; // stringify json
  }
) {
  const response = {
    status: API_SUCCESS,
    data: "widget updated",
  };
  return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
}

// 🤖
export function updateWidgetBulkService(
  abortSignal: AbortSignal,
  payload: {
    widgetId: string[];
    content: string[]; // stringify json
  }
) {
  const response = {
    status: API_SUCCESS,
    data: "all widgets updated",
  };
  return mimicApi(500, JSON.parse(JSON.stringify(response)), abortSignal);
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
  const response = {
    text: "Hello, I'm Rita. I do not understand what you are saying. Ask Edison.",
    sender: "Rita",
  };
  const dummyResponse = {
    status: API_SUCCESS,
    data: response,
  };
  return mimicApi(500, JSON.parse(JSON.stringify(dummyResponse)), abortSignal);
}
