import "./BackToTopBtn.css";
import { useState, useEffect } from "react";
import { FiArrowUpCircle } from "react-icons/fi";

const BackToTopBtn = () => {
  // PROPS DESTRUCTURING -------------------------------------------------
  //

  // USE SELECTOR --------------------------------------------------------
  //

  // USE STATE -----------------------------------------------------------
  //
  const [isVisible, setIsVisible] = useState(false);

  // HANDLE SCROLL TO TOP ------------------------------------------------
  //
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // HANDLE VISIBILITY ---------------------------------------------------
  //
  const handleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // USE EFFECT ----------------------------------------------------------
  //
  useEffect(() => {
    window.addEventListener("scroll", handleVisibility);
    return () => {
      window.removeEventListener("scroll", handleVisibility);
    };
  }, []);

  return (
    <FiArrowUpCircle
      className={`back-to-top-icon ${isVisible ? "visible" : ""}`}
      onClick={handleScrollToTop}
    />
  );
};

export default BackToTopBtn;
