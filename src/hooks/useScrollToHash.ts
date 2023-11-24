import { useCallback } from 'react';

export const useScrollToHash = () => {
  const scroll = useCallback((hash: string, offset?: number, delay = 150) => {
    setTimeout(() => {
      const el = window.document.getElementById(hash);
      if (el) {
        const resOffset = offset || window.innerWidth > 1599 ? 140 : 100;
        const y = el.getBoundingClientRect().top + window.scrollY - resOffset;
        window.scroll({
          top: y,
          behavior: 'smooth',
        });
      }
    }, delay);
  }, []);

  return scroll;
};