import { useEffect } from "react";

function preventNativeScrolling(event: UIEvent) {
  event.preventDefault();
}

export function usePreventNativeScrolling(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;

    if (element != null) {
      element.addEventListener("touchstart", preventNativeScrolling, {
        passive: false,
      });
      element.addEventListener("touchmove", preventNativeScrolling, {
        passive: false,
      });
      element.addEventListener("touchend", preventNativeScrolling, {
        passive: false,
      });
      return () => {
        element.removeEventListener("touchstart", preventNativeScrolling);
        element.removeEventListener("touchmove", preventNativeScrolling);
        element.removeEventListener("touchend", preventNativeScrolling);
      };
    }
  }, []);
}
