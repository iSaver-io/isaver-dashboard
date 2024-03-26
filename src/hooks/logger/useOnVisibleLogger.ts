import { RefObject, useEffect, useState } from 'react';

import { LoggerProps, useLogger } from '../useLogger';
import { useOnScreenObserver } from '../useOnScreenObserver';

export const useOnVisibleLogger = (
  ref: RefObject<HTMLElement>,
  loggerProps: LoggerProps,
  isSingle: boolean = true
) => {
  const [isShown, setIsShown] = useState(false);
  const isVisible = useOnScreenObserver(ref);
  const logger = useLogger(loggerProps);

  useEffect(() => {
    if (isVisible && (!isSingle || (isSingle && !isShown))) {
      logger();
      setIsShown(true);
    }
  }, [isVisible, isSingle, isShown, logger]);
};
