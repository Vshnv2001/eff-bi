import React from "react";
import LaptopDisplay from "./LaptopDisplay";
import FadeIn from "../Animations/FadeIn";
import { Card, CardBody } from "@material-tailwind/react";
import Typography from "@mui/material/Typography";

const Steps: React.FC = () => {
  return (
    <FadeIn>
      <main className="flex flex-col items-center min-h-screen relative">
        <section className="w-full max-w-[1240px] p-5 relative z-10">
          <div className="flex gap-5 max-md:flex-col items-center">
            <div className="flex flex-col justify-center w-full">
              <Card className="mx-auto w-[80%] shadow-2xl bg-white p-6 rounded-lg">
                <CardBody className="flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center w-full space-y-4">
                    <LaptopDisplay
                      content={
                        <img
                          src="/assets/create-tile.jpg"
                          alt="Laptop Display 1"
                          className="object-contain rounded-lg max-w-full max-h-[60vh] scale-y-110"
                        />
                      }
                      label=""
                    />
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/42866618a61135ec34a135b5fd2a5e7144ecc8563c8943a30c69a8fafa7aed1a"
                      alt="Laptop Display"
                      className="object-contain rounded-lg max-w-full"
                    />
                  </div>
                  <div className="flex flex-col items-center mt-10">
                    <Typography
                      variant="h3"
                      className="text-gray-800 text-center font-bold"
                    >
                      Tailored Charts
                    </Typography>
                    <div className="mt-10">
                      <Typography variant="body1" className="text-gray-600">
                        Our system uses a lightweight NLP engine to process your
                        natural language inputs into SQL queries and
                        visualizations. With advanced parsing, we streamline
                        complex data requests and process it within 1 minute.
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </FadeIn>
  );
};

export default Steps;
