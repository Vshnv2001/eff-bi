import { useState, useEffect } from "react";
import Header from "./Header";

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
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
    </main>
  );
};

export default Hero;
