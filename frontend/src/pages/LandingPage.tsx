import Hero from "../components/Hero/Hero";
import AboutUs from "../components/AboutUs/AboutUs";
import Steps from "../components/Steps/Steps";
import Display from "../components/Display/Display";
import Reviews from "../components/Reviews/Reviews";
import Chat from "../components/Footer/Chat";
import ContactUs from "../components/Footer/ContactUs";
import Marquee from "../components/Marquee/Marquee";
import { Typography } from "@mui/material";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <div className="text-center mt-20">
        <Typography
          variant="h2"
          sx={{ fontWeight: "bold" }}
          className="text-center"
        >
          Generate charts with plain English
        </Typography>
      </div>
      <AboutUs />
      <Marquee />
      <Steps />
      <Display />
      <Reviews />
      <Chat />

      <ContactUs />
    </>
  );
};

export default LandingPage;
