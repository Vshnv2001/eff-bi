import Hero from "../components/Hero/Hero";
import AboutUs from "../components/AboutUs/AboutUs";
import Steps from "../components/Steps/Steps";
import Display from "../components/Display/Display";
import Reviews from "../components/Reviews/Reviews";
import Chat from "../components/Footer/Chat";
import ContactUs from "../components/Footer/ContactUs";
import Marquee from "../components/Marquee/Marquee";
import { Typography } from "@mui/material";
import FadeIn from "../components/Animations/FadeIn";
import Flyer from "../components/Flyer/Flyer";
import MockDashboardDisplay from "../components/Display/MockDashboardDisplay";
import {Button} from "@material-tailwind/react";
import ArticleIcon from "@mui/icons-material/Article";
import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-red-100 to-blue-400">
      <Hero />
        <FadeIn>
            <div className="flex text-center justify-center items-center mt-20">
                <img
                    src="../../public/assets/translate.png"
                    alt="Translate Natural Language to Visualisations"
                    className="w-1/2 md:w-1/3 lg:w-1/3"
                />
                <Typography className="flex flex-col items-center mt-4">
                    <span className="text-5xl font-bold">Translate queries into</span>
                    <span className="text-5xl font-bold pt-1">data visualisations</span>
                    <span className="text-xl pt-5">Generate charts seamlessly using plain and simple English.</span>
                    <div className="flex space-x-4 mt-6">
                        <Button className="flex items-center bg-white bg-opacity-80 text-black">
                            Read the docs
                            <ArticleIcon className="ml-2"/>
                        </Button>
                    </div>
                </Typography>
            </div>
        </FadeIn>
        <AboutUs/>
        <Marquee/>
        <MockDashboardDisplay/>
        <Steps/>
        <Flyer/>
        <Display/>
        <Reviews/>
        <Chat/>

        <ContactUs/>
    </div>
  );
};

export default LandingPage;
