import { useState, useEffect } from "react";
import GradientButton from "../Buttons/GradientButton";

const Header: React.FC = () => {
  const [animateEffortless, setAnimateEffortless] = useState(false);
  const [animateVisualisations, setAnimateVisualisations] = useState(false);
  const [animateDescription, setAnimateDescription] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimateEffortless(true);

      setTimeout(() => {
        setAnimateVisualisations(true);

        setTimeout(() => {
          setAnimateDescription(true);

          setTimeout(() => {
            setAnimateButton(true);
          }, 300);
        }, 100);
      }, 100);
    }, 100);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col w-full max-w-screen-xl text-white bg-blend-normal min-h-[516px] max-md:max-w-full">
        <h1 className="flex flex-col items-start pr-20 w-full text-8xl font-light tracking-tighter leading-none whitespace-nowrap bg-blend-normal max-md:pr-5 max-md:text-4xl overflow-hidden">
          <span
            className={`max-md:text-4xl transform transition-transform duration-1000 ease-in-out delay-150 ${
              animateEffortless
                ? "translate-y-0 opacity-100"
                : "translate-y-[100%] opacity-0"
            }`}
          >
            Effortless
          </span>
        </h1>
        <h1 className="flex flex-col items-start pr-20 w-full text-8xl font-light tracking-tighter leading-none whitespace-nowrap bg-blend-normal max-md:pr-5 max-md:text-4xl overflow-hidden">
          <span
            className={`max-md:text-4xl transform transition-transform duration-1000 ease-in-out delay-150 ${
              animateVisualisations
                ? "translate-y-0 opacity-100"
                : "translate-y-[100%] opacity-0"
            }`}
          >
            visualisations
          </span>
        </h1>
        <div className="flex flex-wrap gap-10 items-start mt-20 w-full min-h-0 bg-blend-normal max-md:mt-10">
          <div className="flex flex-col pb-96 bg-blend-normal min-h-[252px] min-w-[240px] w-[410px] max-md:pb-24">
            <p className="flex flex-col items-start pr-20 w-full max-w-2xl text-2xl font-light tracking-tighter leading-none whitespace-nowrap bg-blend-normal max-md:pr-5 max-md:text-3xl overflow-hidden">
              <span
                className={`max-md:text-3xl transform transition-transform duration-1000 ease-in-out delay-150 ${
                  animateDescription
                    ? "translate-y-0 opacity-100"
                    : "translate-y-[100%] opacity-0"
                }`}
              >
                Experience no-code data visualization.
              </span>
            </p>
            <div
              className={`mt-6 transform transition-opacity duration-1000 ease-in-out ${
                animateButton ? "opacity-100" : "opacity-0"
              }`}
            >
              <GradientButton text="Get Started" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
