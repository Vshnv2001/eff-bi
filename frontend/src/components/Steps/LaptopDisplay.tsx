interface LaptopDisplayProps {
  content: React.ReactNode;
  label: string;
}

const LaptopDisplay: React.FC<LaptopDisplayProps> = ({ content, label }) => {
  return (
    <div className="flex flex-col self-center px-1 py-0.5 max-w-full bg-gray-900 rounded-3xl border-2 border-solid border-slate-600 w-[551px]">
      <div className="flex flex-col justify-center px-3 py-4 bg-black rounded-3xl max-md:max-w-full">
        <div className="flex shrink-0 bg-white h-[321px] max-md:max-w-full">
          {content}
        </div>
      </div>
      <p className="z-10 self-center mb-0 text-sm font-semibold leading-none text-center text-slate-400">
        {label}
      </p>
    </div>
  );
};

export default LaptopDisplay;