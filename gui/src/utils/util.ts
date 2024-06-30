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
    signal!.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

export function isNumeric(str: string) {
  return /^\d+$/.test(str);
}
