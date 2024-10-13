import { useEffect, useRef } from "react";
import ImageItem from "./ImageItem";

const images = [
  {
    id: "mysql",
    alt: "MySQL",
    src: "/assets/logos/my-sql.svg",
  },
  {
    id: "postgresql",
    alt: "PostgreSQL",
    src: "/assets/logos/postgres-sql.svg",
  },
  {
    id: "sqlite",
    alt: "SQLite",
    src: "/assets/logos/sql-lite.svg",
  },
  {
    id: "oracle",
    alt: "Oracle DB",
    src: "/assets/logos/oracle.svg",
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
            observer.unobserve(target);
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