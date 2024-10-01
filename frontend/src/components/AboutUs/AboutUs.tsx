import FeatureCard from "./FeatureCard";
import features from "./Features";

const AboutUs = () => {
  return (
    <div>
      <div className="flex flex-wrap gap-6 items-start max-w-full text-white bg-blend-normal min-h-[107px] w-full max-md:mt-10 bg-black">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default AboutUs;