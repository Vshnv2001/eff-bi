import FadeIn from "../Animations/FadeIn";
import { Typography } from "@material-tailwind/react";

const Header: React.FC = () => {
  return (
    <header className="flex flex-col justify-center items-center self-center max-w-full w-[610px]">
      <FadeIn>
        <Typography variant="h1" className="text-center">
          Database Connection
        </Typography>
      </FadeIn>

      <FadeIn>
        <p className="mt-6 text-2xl text-center text-neutral-800 text-opacity-80 max-md:max-w-full font-normal">
          Eff BI securely connects to popular databases with read-only access,
          ensuring data protection while enabling teams to generate insightful
          charts directly from existing tables and data, including OLAP databases.
        </p>
      </FadeIn>
    </header>
  );
};

export default Header;
