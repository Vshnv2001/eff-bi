import { useState, useEffect } from "react";
import Header from "./Header";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [arrowOpacity, setArrowOpacity] = useState(1);

  const handleScroll = () => {
    setScrollY(window.scrollY);

    if (window.scrollY > 0) {
      setArrowOpacity(0);
    } else {
      setArrowOpacity(1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const opacity = Math.min(scrollY / 1000, 0.7);

  return (
    <main className="relative flex overflow-hidden flex-col">
      <div
        className="absolute top-0 left-0 w-full h-screen bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: `url('/assets/cover-slanted.png')`,
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      ></div>

      <div>
        <Header />
      </div>

      <div
        className="absolute top-0 left-0 w-full h-screen"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${opacity})`,
        }}
      ></div>

      <div
        className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ease-in-out`}
        style={{ opacity: arrowOpacity }}
      >
        <ChevronDownIcon
          className="w-10 h-10 text-black animate-bounce"
          onClick={() => {
            const featuresSection =
              document.getElementById("after-hero-section");
            if (featuresSection) {
              featuresSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />
      </div>
    </main>
  );
};

export default Hero;
