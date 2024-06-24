import {useCallback, useEffect, useRef, useState} from "react";
import {formatTime} from "./util";
import {RawAxiosResponseHeaders} from "axios";

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
 * @param apiFunction - The async function that is called
 * @param sideEffect (optional) - The function that is called if the API call succeeds.
 * It performs calculation and modification to the response, such as parsing,
 * and returns an object that is suitable for the context.
 * Returns the response of the API call by default.
 * @param debug (optional) - Whether to log the API call
 * @param identifier (optional) - The identifier of the API call (for debugging)
 */
interface ApiHandlerArgs {
  apiFunction: (c: AbortSignal) => Promise<Response>;
  sideEffect?: (r: JSON) => JSON;
  debug?: boolean;
  identifier?: string;
}
interface ApiHandlerResult {
  apiHandler: ({
    apiFunction,
    sideEffect,
    debug,
    identifier,
  }: ApiHandlerArgs) => Promise<JSON>;
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
      sideEffect = (r: JSON) => r,
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

        // FIXME: This section depends on response obj shape
        let r = await apiFunction(signal);
        if (!r.ok) {
          throw new Error("Network response was not ok" + r.statusText);
        }

        let body = await r.json();
        if (body.status === "Error") {
          throw new Error(body.response);
        }

        if (debug) {
          console.log(
            `Response | ${identifier} | ${formatTime(new Date())}`,
            r
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
        console.warn(msg);
        const errorResponse = {status: "error", response: msg};
        return JSON.parse(JSON.stringify(errorResponse));
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

export function login(username: string, password: string) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  return fetch(BASE_URL_DEV + "/login", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: formData,
  });
}
