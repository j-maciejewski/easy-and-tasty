import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [prevOffset, setPrevOffset] = useState(0);

  useEffect(() => {
    const toggleScrollDirection = () => {
      const scrollY = window.scrollY;
      if (scrollY < 0) {
        setScrollDirection("up");
      }
      if (Math.abs(scrollY - prevOffset) < 10) {
        return;
      }
      const direction = scrollY > prevOffset ? "down" : "up";
      if (direction !== scrollDirection) {
        setScrollDirection(direction);
      }
      setPrevOffset(scrollY);
    };

    window.addEventListener("scroll", toggleScrollDirection);

    return () => {
      window.removeEventListener("scroll", toggleScrollDirection);
    };
  }, [scrollDirection, prevOffset]);

  return scrollDirection;
}
