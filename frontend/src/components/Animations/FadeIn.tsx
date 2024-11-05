import React, { useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
}

const FadeIn: React.FC<FadeInProps> = ({ children, duration = 0.6 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-transform transition-opacity duration-[${duration}s] ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        transition: `opacity ${duration}s ease-in-out, transform ${duration}s ease-in-out`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeIn;