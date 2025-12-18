import * as React from "react"
import { getWindowWidth, addWindowEventListener, matchMedia } from "@/lib/browserUtils"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize with actual value if available
    return getWindowWidth() < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    // Set initial value safely
    const updateMobile = () => {
      setIsMobile(getWindowWidth() < MOBILE_BREAKPOINT);
    };
    
    updateMobile();
    
    // Add media query listener
    const mql = matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    if (mql) {
      const onChange = () => updateMobile();
      mql.addEventListener("change", onChange);
      
      // Also listen to orientationchange for better mobile support
      const cleanupResize = addWindowEventListener('orientationchange', updateMobile);
      
      return () => {
        mql.removeEventListener("change", onChange);
        cleanupResize();
      };
    }
    
    // Fallback to resize listener
    const cleanupResize = addWindowEventListener('resize', updateMobile);
    const cleanupOrientation = addWindowEventListener('orientationchange', updateMobile);
    
    return () => {
      cleanupResize();
      cleanupOrientation();
    };
  }, []);

  return isMobile;
}
