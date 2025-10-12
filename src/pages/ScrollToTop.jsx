// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ smooth = true }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // scroll to top on every route change
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  }, [pathname, smooth]);

  return null;
};

export default ScrollToTop;
