import { useLayoutEffect, RefObject, useRef } from 'react';

interface ClientRectCallback {
  (rect: DOMRectReadOnly): void;
}
export function useClientBoundingRect(onRectUpdate: ClientRectCallback, ref: RefObject<Element>) {
  const callbackRef = useRef(onRectUpdate);
  callbackRef.current = onRectUpdate;

  useLayoutEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      // Call the provided callback with the boundingClientRect
      callbackRef.current(entry.boundingClientRect);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

}