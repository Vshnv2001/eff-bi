const Header: React.FC = () => {
  return (
    <header className="flex flex-col justify-center items-center self-center max-w-full font-black w-[610px]">
      <h1 className="text-6xl text-center leading-[80px] text-neutral-800 max-md:max-w-full max-md:text-4xl max-md:leading-[55px] overflow-hidden whitespace-nowrap">
        Database Connection
      </h1>
      <p className="mt-6 text-2xl text-left text-neutral-800 text-opacity-80 max-md:max-w-full">
        Eff BI allows connection to well-known databases with read-only access,
        enabling the generation of charts from the tables and data within the
        databases.
      </p>
    </header>
  );
};

export default Header;
