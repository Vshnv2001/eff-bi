import { useState, useEffect } from "react";

const Chat: React.FC = () => {
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

  const backgroundFadeOpacity = Math.min(scrollY / 500, 1);

  return (
    <div className="relative overflow-hidden h-screen">
      {/* Background image fixed in place */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: `url('/assets/big-data.jpg')`,
        }}
      ></div>

      {/* Fade overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${1 - backgroundFadeOpacity})`,
          transition: 'background-color 0.3s ease',
        }}
      ></div>
    </div>
  );
};

export default Chat;