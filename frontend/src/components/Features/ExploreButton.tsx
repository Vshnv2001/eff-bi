import React, { useState } from "react";

const ExploreButton: React.FC = () => {
  const [rippleStyle, setRippleStyle] = useState<React.CSSProperties | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    setRippleStyle({
      width: `${size}px`,
      height: `${size}px`,
      top: `${y}px`,
      left: `${x}px`,
    });

    // Remove ripple effect after animation duration
    setTimeout(() => setRippleStyle(null), 600);
  };

  return (
    <button
      className="bg-black relative overflow-hidden bg-neutral-800 rounded-[36px] px-4 py-2 text-white whitespace-nowrap leading-none hover:bg-neutral-700 focus:outline-none"
      onClick={handleClick}
    >
      <span className="font-bold text-black">Explore</span>
      {rippleStyle && (
        <span
          className="absolute rounded-full bg-white opacity-30 transform transition-transform"
          style={{
            ...rippleStyle,
            position: "absolute",
            transform: "scale(0)",
            animation: "ripple 0.6s linear",
          }}
        />
      )}
      <style>
        {`
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}
      </style>
    </button>
  );
};

export default ExploreButton;