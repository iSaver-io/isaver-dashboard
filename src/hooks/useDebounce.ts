import { useCallback, useRef } from 'react';

type Timer = ReturnType<typeof setTimeout>;
type SomeFunction = (...args: any[]) => void;

/**
 *
 * @param callback The original, non debounced function (You can pass any number of args to it)
 * @param delay The delay (in ms) for the function to return
 * @returns The debounced function, which will run only if the debounced function has not been called in the last (delay) ms
 */
export const useDebounce = <Func extends SomeFunction>(callback: Func, delay = 1000) => {
  const timerRef = useRef<Timer>();

  const debouncedCallback = useCallback<Func>(
    // TODO: fix ts
    // @ts-ignore
    (...args) => {
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};
