import {sign} from "crypto";
import {useState} from "react";

export function formatTime(date: Date): string {
  const padZero = (num: number): string => (num < 10 ? "0" : "") + num;

  const year = date.getFullYear().toString().slice(-2);
  const month = padZero(date.getMonth() + 1); // Months are zero-based
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}

export function generateId(): string {
  return (
    new Date().valueOf().toString(36) + Math.random().toString(36).substring(2)
  );
}

export const delay = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const mimicApi = (
  ms: number,
  dummyResponse: JSON,
  signal?: AbortSignal
): Promise<Response> =>
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      const r = new Response(
        new Blob([JSON.stringify(dummyResponse, null, 2)], {
          type: "application/json",
        })
      );
      resolve(r);
    }, ms);

    // Listen for the abort event to clear the timeout and reject the promise
    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

export const mimicStreamApi = async function (
  ms: number,
  chunkList: string[],
  signal?: AbortSignal
): Promise<Response> {
  const streamGenerator = async function* () {
    // Function to simulate sending chunks asynchronously
    for (let chunk of chunkList) {
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      // Simulate delay between chunks
      await delay(ms);

      let r = new TextEncoder().encode(chunk);
      yield r;
    }
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of streamGenerator()) {
          controller.enqueue(chunk);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
  const response = new Response(stream, {
    status: 200,
    statusText: "OK",
    headers: new Headers({
      "Content-Type": "application/octet-stream", // Adjust content type as needed
    }),
  });
  return response;
};
export function isNumeric(str: string) {
  return /^\d+$/.test(str);
}

export const overrideConsoleWarning = (ignorePattern: string) => {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const [msgId, msg] = args;
    if (
      (typeof msgId === "string" && msgId.includes(ignorePattern)) ||
      (typeof msg === "string" && msg.includes(ignorePattern))
    ) {
      return; // Ignore specific warning messages containing '002'
    }

    originalWarn.apply(console, args); // Pass all arguments to original console.warn
  };
};

export function pointIsInRect(
  point: {x: number; y: number},
  rect: {x: number; y: number; width: number; height: number}
) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export const useCompose = () => {
  const [isComposing, setIsComposing] = useState(false);
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return {
    isComposing,
    handleCompositionStart,
    handleCompositionEnd,
  };
};
export function replaceTabsWithSpaces(input: string, spaceCount = 2) {
  // Replace each tab with the equivalent number of spaces
  return input.replace(/\t/g, " ".repeat(spaceCount));
}
