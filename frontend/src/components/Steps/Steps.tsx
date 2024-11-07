import React from "react";
import LaptopDisplay from "./LaptopDisplay";
import FadeIn from "../Animations/FadeIn";
import {Button, Card, CardBody} from "@material-tailwind/react";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";

const Steps: React.FC = () => {
  return (
    <FadeIn>
      <main className="flex flex-col items-center min-h-screen relative">
        <section className="w-full max-w-[1240px] p-5 relative z-10">
          <div className="flex gap-5 max-md:flex-col items-center">
            <div className="flex flex-col justify-center w-full">
              <Card className="mx-auto w-[80%] shadow-3xl bg-transparent p-6 rounded-lg">
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
                        className="text-black text-center font-bold"
                    >
                      Tailored Charts
                    </Typography>
                    <div className="mt-2">
                      <Typography variant="body1" className="text-black">
                        Eff BI's lightweight NLP engine processes your
                        natural language inputs into SQL queries and
                        visualizations efficiently.
                      </Typography>
                    </div>
                    <div className="flex space-x-4 mt-6">
                      <Button className="flex items-center bg-white bg-opacity-80 text-black">
                        Read the docs
                        <ArticleIcon className="ml-2"/>
                      </Button>
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
