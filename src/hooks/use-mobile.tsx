import * as React from "react"
import { getWindowWidth, addWindowEventListener, matchMedia } from "@/lib/browserUtils"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false) // Safe default

  React.useEffect(() => {
    // Set initial value safely
    setIsMobile(getWindowWidth() < MOBILE_BREAKPOINT);
    
    // Add media query listener
    const mql = matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    if (mql) {
      const onChange = () => {
        setIsMobile(getWindowWidth() < MOBILE_BREAKPOINT);
      };
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    
    // Fallback to resize listener
    const cleanup = addWindowEventListener('resize', () => {
      setIsMobile(getWindowWidth() < MOBILE_BREAKPOINT);
    });
    return cleanup;
  }, []);

  return isMobile
}
