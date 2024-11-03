const Header: React.FC = () => {
  return (
    <header className="flex flex-col justify-center items-center self-center max-w-full font-black w-[610px]">
      <h1 className="text-6xl text-center leading-[80px] text-neutral-800 max-md:max-w-full max-md:text-4xl max-md:leading-[55px] overflow-hidden whitespace-nowrap">
        Database Connection
      </h1>
      <p className="mt-6 text-2xl text-center text-neutral-800 text-opacity-80 max-md:max-w-full font-normal">
        Eff BI securely connects to popular databases with read-only access,
        ensuring data protection while enabling teams to generate insightful
        charts directly from existing tables and data.
      </p>
    </header>
  );
};

export default Header;
