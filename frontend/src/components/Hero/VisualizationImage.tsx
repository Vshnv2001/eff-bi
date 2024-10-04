const VisualizationImage: React.FC = () => {
    return (
      <div className="flex overflow-hidden flex-col mt-20 max-w-full rounded bg-blend-normal w-[1280px] max-md:mt-10">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/b7ebdb7e908b8b8a22283b855eb35060f6ff8d85cb0882da04772703c316db3a?apiKey=605ddb38b3184de6b494a658ff50786d&" alt="Detailed visualization example" className="object-contain w-full bg-blend-normal aspect-[1.68] max-md:max-w-full" />
      </div>
    );
  };
  
  export default VisualizationImage;