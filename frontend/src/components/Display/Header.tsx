const Header: React.FC = () => {
  return (
    <header className="flex flex-col justify-center items-center self-center max-w-full font-black w-[610px]">
      <h1 className="text-6xl text-center leading-[80px] text-neutral-800 max-md:max-w-full max-md:text-4xl max-md:leading-[55px] overflow-hidden whitespace-nowrap">
        Render beautiful charts
      </h1>
      <p className="mt-6 text-2xl text-left text-neutral-800 text-opacity-80 max-md:max-w-full">
        eff-BI automatically renders various charts based on the dataset
        provided. If you prefer to specify the charts, eff-BI will generate them
        accordingly.
      </p>
    </header>
  );
};

export default Header;
