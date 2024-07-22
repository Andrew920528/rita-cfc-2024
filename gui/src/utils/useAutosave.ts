import {useEffect, useRef} from "react";

/** Use this hook for tasks that need to be run periodically.
 * https://www.codemzy.com/blog/autosave-reactjs-with-setinterval <-- Thanks champ!
 * @param callback
 * @param delay
 * @param deps
 */
function useAutosave(
  callback: () => void,
  delay: number = 1000,
  deps: React.DependencyList = []
): void {
  const savedCallback = useRef<() => void>();

  // keep callback ref up to date
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // create the interval
  useEffect(() => {
    // function to call the callback
    function runCallback() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (typeof delay === "number") {
      // run the interval
      const interval = setInterval(runCallback, delay);
      // clean up on unmount or dependency change
      return () => clearInterval(interval);
    }
  }, [delay, ...deps]);
}

export default useAutosave;
