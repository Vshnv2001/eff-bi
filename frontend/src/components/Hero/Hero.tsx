import FeatureCard from "./FeatureCard";
import Header from "./Header";
import VisualizationImage from "./VisualizationImage";
import features from "./Features";

const Hero: React.FC = () => {
  return (
    <main className="flex overflow-hidden flex-col bg-blend-normal bg-slate-900">
      <section className="flex relative flex-col justify-center px-8 py-36 w-full min-h-[1816px] max-md:px-5 max-md:py-24 max-md:max-w-full">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/7b0d1db4059d8fcdada566b8fe98c0d34acc5ab982ecbca19ce2f0ec49b62ad8?apiKey=605ddb38b3184de6b494a658ff50786d&" alt="" className="object-cover absolute inset-0 size-full" />
        <div className="flex relative flex-col px-10 pb-10 mb-0 w-full bg-blend-normal max-md:px-5 max-md:mb-2.5 max-md:max-w-full">
          <Header />
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