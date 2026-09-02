import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

function BackToTop() {

  const [show, setShow] = useState(false);

  useEffect(() => {

    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  if (!show) return null;

  return (
    <button
      className="back-top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    >
      <FaArrowUp />
    </button>
  );
}

export default BackToTop;