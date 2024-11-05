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
    <>
      <Hero />
      <FadeIn>
        <div className="text-center mt-20">
          <Typography variant="h2" className="text-center">
            Generate charts with plain English
          </Typography>
        </div>
      </FadeIn>
      <AboutUs />
      <Marquee />
      <Flyer />
      <Steps />
      <Display />
      <MockDashboardDisplay />
      <Reviews />
      <Chat />

      <ContactUs />
    </>
  );
};

export default LandingPage;
