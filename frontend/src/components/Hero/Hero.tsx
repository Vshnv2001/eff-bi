import FeatureCard from "./FeatureCard";
import Header from "./Header";
import VisualizationImage from "./VisualizationImage";
import features from "./Features";

const Hero: React.FC = () => {
  return (
    <main className="flex overflow-hidden flex-col bg-blend-normal bg-slate-900 bg-black">
      <section className="flex relative flex-col justify-center px-8 py-36 w-full min-h-[1816px] max-md:px-5 max-md:py-24 max-md:max-w-full">
        <Header />
        <div className="flex relative flex-col px-10 pb-10 mb-0 w-full bg-blend-normal max-md:px-5 max-md:mb-2.5 max-md:max-w-full">
          <VisualizationImage />
          <div className="flex flex-wrap gap-6 items-start mt-20 max-w-full text-white bg-blend-normal min-h-[107px] w-[1280px] max-md:mt-10">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
