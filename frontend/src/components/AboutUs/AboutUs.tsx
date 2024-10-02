import FeatureCard from "./FeatureCard";
import features from "./Features";

const AboutUs = () => {
  return (
    <div className="w-full bg-black text-white">
      <div className="w-full flex justify-center p-6">
        <img
          src="/assets/bg.jpg"
          alt="About Us"
          className="w-11/12 max-w-4xl h-auto object-contain rounded-lg shadow-lg"
        />
      </div>

      <div className="flex flex-wrap gap-6 items-start max-w-full bg-blend-normal min-h-[107px] w-full max-md:mt-10 p-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default AboutUs;