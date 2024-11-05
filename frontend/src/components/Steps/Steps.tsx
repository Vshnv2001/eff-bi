import LaptopDisplay from "./LaptopDisplay";
import TextSection from "./TextSection";
import FadeIn from "../Animations/FadeIn";

const Steps: React.FC = () => {
  return (
    <main className="flex flex-col items-center bg-gradient-to-b from-[#fafafb] to-[#f0f2fe] relative">
      {/* First Section */}
      <section className="w-full max-w-[1240px] p-5 relative z-10">
        <div className="flex gap-5 max-md:flex-col items-center">
          <div className="flex flex-col justify-center w-1/2 max-md:w-full">
            <FadeIn>
              <TextSection
                title="Use natural language to create business insights"
                description="Our system uses a lightweight NLP engine to process your natural language inputs into SQL queries and visualizations. With advanced parsing, we streamline complex data requests."
              />
            </FadeIn>
          </div>
          <div className="flex flex-col w-1/2 max-md:w-full">
            <LaptopDisplay
              content={
                <img
                  src="/assets/create-tile.jpg"
                  alt="Laptop Display 1"
                  className="object-contain rounded-lg max-w-full scale-y-110"
                />
              }
              label=""
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/42866618a61135ec34a135b5fd2a5e7144ecc8563c8943a30c69a8fafa7aed1a"
              alt="Laptop Display"
              className="object-contain mt-4 rounded-lg max-w-full"
            />
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section className="w-full max-w-[1240px] mt-10 p-5 relative z-10">
        <div className="flex gap-5 max-md:flex-col items-center">
          <div className="flex flex-col w-1/2 max-md:w-full">
            <LaptopDisplay
              content={
                <img
                  src="/assets/db-permissions.png"
                  alt="Laptop Display 2"
                  className="object-contain rounded-lg max-w-full"
                />
              }
              label=""
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/42866618a61135ec34a135b5fd2a5e7144ecc8563c8943a30c69a8fafa7aed1a"
              alt="Laptop Display"
              className="object-contain mt-4 rounded-lg max-w-full"
            />
          </div>
          <div className="flex flex-col justify-center w-1/2 max-md:w-full">
            <FadeIn>
              <TextSection
                title="Customise user roles"
                description="Add users to your organization and assign them roles with ease.
                Customize each user's role, and grant admin privileges to manage
                higher-level tasks when necessary."
              />
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Steps;