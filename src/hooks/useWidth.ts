import { useState, useLayoutEffect, useRef, useCallback } from 'react';

export const useWidth = () => {
  const [width, setWidth] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null!);

  const getWidth = (el: HTMLDivElement) => {
    if (el !== null) {
      setWidth(el.getBoundingClientRect().width);
    }
  };

  const widthRef = useCallback((node) => {
    if (node) {
      getWidth(node);
    }

    ref.current = node;
  }, []);

  useLayoutEffect(() => {
    const captureWidthOnResize = () => getWidth(ref.current);

    window.addEventListener('resize', captureWidthOnResize);
    return () => {
      window.removeEventListener('resize', captureWidthOnResize);
    };
  }, [ref]);

  return [width, widthRef] as const;
};
