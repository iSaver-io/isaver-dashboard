import { RefObject, useEffect } from 'react';

import { useLogger } from '../useLogger';
import { useOnScreenObserver } from '../useOnScreenObserver';

export const useOnVisibleLogger = (
  ref: RefObject<HTMLElement>,
  label: 'our_numbers' | 'our_plans' | 'our_mini'
) => {
  const isVisible = useOnScreenObserver(ref);
  const logger = useLogger({
    event: 'landing',
    category: 'blocks',
    action: 'page_sсroll',
    buttonLocation: 'mid',
    actionGroup: 'interactions',
  });

  useEffect(() => {
    if (isVisible) {
      logger({ label });
    }
  }, [isVisible, logger, label]);
};
