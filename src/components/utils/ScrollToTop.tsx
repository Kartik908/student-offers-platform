/**
 * A utility component that scrolls the window to the top on route changes.
 * Skips scrolling on initial mount to preserve scroll position on refresh.
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip scroll on initial mount (refresh/first load)
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Only scroll to top on actual navigation
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;