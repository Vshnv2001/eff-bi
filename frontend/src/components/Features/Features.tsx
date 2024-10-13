import { useEffect, useRef } from "react";
import ImageComponent from "./ImageComponent";

const Features: React.FC = () => {
  const images = [
    {
      src: "/assets/permission-page.png",
      alt: "Upload view export illustration 1",
    },
    {
      src: "/assets/permission-grant.png",
      alt: "Upload view export illustration 2",
    }
  ];

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
    <main className="overflow-hidden px-16 py-16 bg-white max-md:px-5">
      <div className="flex gap-5 max-md:flex-col">
        <section className="flex flex-col w-5/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
            <div className="flex flex-col w-full text-2xl font-black max-md:max-w-full">
              <h1 className="text-7xl leading-[88px] text-neutral-800 max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
                Customise User Roles
              </h1>
              <p className="mt-6 text-neutral-800 text-opacity-80 max-md:max-w-full">
              Add users to your organization and assign them roles with ease.
              Customize each user's role, and grant admin privileges to manage higher-level tasks if needed.
              </p>
            </div>
          </div>
        </section>
        <section className="flex flex-col ml-5 w-7/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
            <div className="ml-4 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col">
                <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                  <div
                    ref={(el) => (imageRefs.current[0] = el)}
                    className="scale-110 opacity-0 transition-transform duration-300 ease-in-out hover:scale-105"
                  >
                    <ImageComponent
                      src={images[0].src}
                      alt={images[0].alt}
                      className="grow mt-52 max-md:mt-10"
                    />
                  </div>
                </div>
                <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                  <div
                    ref={(el) => (imageRefs.current[1] = el)}
                    className="scale-110 opacity-0 transition-transform duration-300 ease-in-out hover:scale-105"
                  >
                    <ImageComponent
                      src={images[1].src}
                      alt={images[1].alt}
                      className="max-md:mt-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Features;