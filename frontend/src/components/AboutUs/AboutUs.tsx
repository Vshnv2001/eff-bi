import TextCard from "./TextCard";
import Texts from "./Texts";
import ChartsGrid from "./ChartsGrid";

const AboutUs = () => {
  return (
    <div className="w-full bg-black text-white pt-6" id="features">
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-6xl text-white leading-[88px] max-md:text-4xl max-md:leading-[54px] mb-6 text-center">
          Render Beautiful Charts
        </h1>
        <div className="w-1/2">
          <ChartsGrid />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 items-start max-w-full bg-blend-normal min-h-[107px] w-full max-md:mt-10 p-6">
        {Texts.map((text, index) => (
          <TextCard key={index} {...text} />
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
