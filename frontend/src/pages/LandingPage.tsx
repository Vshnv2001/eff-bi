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

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-red-100 to-blue-400">
      <Hero />
      <FadeIn>
        <div className="text-center mt-20">
          <Typography className="text-center flex flex-col">
            <span className="text-5xl font-bold">Generate charts</span>
            <span className="text-5xl font-bold">with simple English</span>
          </Typography>
        </div>
      </FadeIn>
      <AboutUs />
      <Marquee />
      <MockDashboardDisplay />
      <Steps />
      <Flyer />
      <Display />
      <Reviews />
      <Chat />

      <ContactUs />
    </div>
  );
};

export default LandingPage;
