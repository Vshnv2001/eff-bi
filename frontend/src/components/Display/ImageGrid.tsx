import { useEffect, useRef } from "react";
import ImageItem from "./ImageItem";

const images = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/a56d866db06b6d48cc62e8b5084a8c835731e75a5c1e8dca7251fca06e9b8f62?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d",
    alt: "Beautiful landscape 1",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/74062cb58afadcff2da6b28dd158ec5b3709dd0629d9e19315e28c7365dad235?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d",
    alt: "Beautiful landscape 2",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/7c69d9430205d1ea9727b2aef650409b54c62c70aac0b873d8c31af59b258ca7?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d",
    alt: "Beautiful landscape 3",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/8c9572dda63cbe69f160172a8f09da71a5bfa48378e9891281fad1ee9de30f3d?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d",
    alt: "Beautiful landscape 4",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/8baa4ffc43047e15b3294bf940dd48175c609fe49c60f7c398bf23319728e1c7?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d",
    alt: "Beautiful landscape 5",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/5dc6db55df34c252e62b9d2996a563bcef162963f673d977a88b8d52f392228b?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d",
    alt: "Beautiful landscape 6",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/8baa4ffc43047e15b3294bf940dd48175c609fe49c60f7c398bf23319728e1c7?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d",
    alt: "Beautiful landscape 7",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/5dc6db55df34c252e62b9d2996a563bcef162963f673d977a88b8d52f392228b?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d",
    alt: "Beautiful landscape 8",
  },
];

const ImageGrid: React.FC = () => {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.remove("scale-110", "opacity-0");
            target.classList.add("scale-100", "opacity-100");
            observer.unobserve(target); // Stop observing once it has faded in
          }
        });
      });

      imageRefs.current.forEach((imgRef) => {
        if (imgRef) observer.observe(imgRef);
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="flex flex-col items-center mt-20 max-md:mt-10">
      <div className="flex flex-wrap gap-4 items-start max-md:max-w-full">
        {images.slice(0, 4).map((image, index) => (
          <div
            ref={(el) => (imageRefs.current[index] = el)}
            key={index}
            className="scale-110 opacity-0 transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <ImageItem src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-4 items-start mt-4 max-md:max-w-full">
        {images.slice(4).map((image, index) => (
          <div
            ref={(el) => (imageRefs.current[index + 4] = el)}
            key={index + 4}
            className="scale-110 opacity-0 transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <ImageItem src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageGrid;