import TextCard from "./TextCard";
import Texts from "./Texts";
import ApexChartsGrid from "./ApexChartsGrid";

const AboutUs = () => {
  return (
    <div className="w-full bg-black text-white">
  <div className="w-full flex justify-center p-6">
    <div className="w-1/2 h-1/2">
      <ApexChartsGrid />
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