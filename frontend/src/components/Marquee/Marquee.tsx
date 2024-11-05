import { useEffect, useRef, useState } from "react";

const Marquee: React.FC = () => {
  const [paused, setPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const scrollAmount = 1;
    let animationFrameId: number;

    const step = () => {
      if (!paused) {
        marquee.scrollLeft += scrollAmount;
        if (marquee.scrollLeft >= marquee.scrollWidth / 2) {
          marquee.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [paused]);

  return (
    <div
      className="overflow-hidden whitespace-nowrap cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={marqueeRef}
      style={{ height: "150px" }}
    >
      {[
        "/assets/aws-beckrock.png",
        "/assets/claude.png",
        "/assets/gemeni.png",
        "/assets/langchain.png",
        "/assets/openai.png",
      ].map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`stock-${index}`}
          className="inline-block h-full object-cover"
          style={{ width: "200px", margin: "0 10px" }}
        />
      ))}
      {/* Duplicate images for seamless scrolling */}
      {[
        "https://via.placeholder.com/200?text=Image+1",
        "https://via.placeholder.com/200?text=Image+2",
        "https://via.placeholder.com/200?text=Image+3",
        "https://via.placeholder.com/200?text=Image+4",
        "https://via.placeholder.com/200?text=Image+5",
      ].map((image, index) => (
        <img
          key={`duplicate-${index}`}
          src={image}
          alt={`stock-${index}-duplicate`}
          className="inline-block h-full object-cover"
          style={{ width: "200px", margin: "0 10px" }}
        />
      ))}
    </div>
  );
};

export default Marquee;
