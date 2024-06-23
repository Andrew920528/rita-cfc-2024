import {useCallback, useRef, useState} from "react";
import {formatTime} from "./util";

/** API Handler
 * A hook that does error handling and other utilities for an API call.
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
  apiFunction: (c: AbortSignal) => Promise<any>;
  sideEffect?: (r: any) => any;
  debug?: boolean;
  identifier?: string;
}
// FIXME: define response type
interface ApiHandlerResult {
  apiHandler: ({
    apiFunction,
    sideEffect,
    debug,
    identifier,
  }: ApiHandlerArgs) => Promise<any>;
  loading: boolean;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  terminateResponse: () => void;
}
export const useApiHandler = (): ApiHandlerResult => {
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  function terminateResponse() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  }
  const apiHandler = useCallback(
    async ({
      apiFunction,
      sideEffect = (r: any) => r,
      debug = false,
      identifier = "",
    }: ApiHandlerArgs) => {
      setLoading(true);
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      try {
        if (debug) {
          console.log(`Request | ${identifier} | ${formatTime(new Date())}`);
        }

        // FIXME: This section depends on response obj shape
        let r = await apiFunction(signal);
        // if (!r.ok) {
        //   throw new Error("Network response was not ok " + r.statusText);
        // }
        if (r.status === "Error") {
          throw new Error(r.response);
        }

        if (debug) {
          console.log(
            `Response | ${identifier} | ${formatTime(new Date())}`,
            r
          );
        }

        return sideEffect(r);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // console.log("Fetch aborted");
        } else if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("unknow error occured");
        }
        return "ERROR";
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
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
