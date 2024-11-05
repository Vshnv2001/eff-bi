import { useRef, useState } from "react";
import { Typography } from "@mui/material";

const Marquee = () => {
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const logos = [
    "https://cdn.brandfetch.io/openai.com/w/512/h/126/logo",
    "https://cdn.brandfetch.io/claude.ai/w/512/h/111/logo",
    "https://cdn.brandfetch.io/llamaindex.ai/w/512/h/101/logo",
    "https://cdn.brandfetch.io/langchain.com/w/512/h/87/logo",
    "https://cdn.brandfetch.io/anthropic.com/w/512/h/58/logo",
    "https://cdn.brandfetch.io/openai.com/w/512/h/126/logo",
    "https://cdn.brandfetch.io/claude.ai/w/512/h/111/logo",
    "https://cdn.brandfetch.io/llamaindex.ai/w/512/h/101/logo",
    "https://cdn.brandfetch.io/langchain.com/w/512/h/87/logo",
    "https://cdn.brandfetch.io/anthropic.com/w/512/h/58/logo",
  ];

  return (
    <div>
      <Typography variant="h4" className="text-center">
        Embed your own AI models for data visualization.
      </Typography>
      <div className="relative w-full overflow-hidden rounded-xl">
        <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white/90 to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white/90 to-transparent" />

        <div
          className="flex items-center py-8 overflow-hidden whitespace-nowrap"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={containerRef}
            className={`flex gap-12 animate-scroll`}
            style={{
              animationPlayState: paused ? "paused" : "running",
              animation: "scroll 30s linear infinite",
            }}
          >
            {/* First set of logos */}
            {logos.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-2 transition-transform hover:scale-110"
              >
                <div className="h-16 w-32 relative">
                  <img
                    src={image}
                    alt={`Partner ${index + 1}`}
                    className="h-full w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}

            {/* Duplicate set for seamless loop */}
            {logos.map((image, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 px-2 transition-transform hover:scale-110"
              >
                <div className="h-16 w-32 relative">
                  <img
                    src={image}
                    alt={`Partner ${index + 1}`}
                    className="h-full w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marquee;