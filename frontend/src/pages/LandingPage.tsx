import Hero from "../components/Hero/Hero";
import AboutUs from "../components/AboutUs/AboutUs";
import Steps from "../components/Steps/Steps";
import Display from "../components/Display/Display";
import Reviews from "../components/Reviews/Reviews";
import Chat from "../components/Footer/Chat";
import ContactUs from "../components/Footer/ContactUs";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <AboutUs />
      <Steps />
      <Display />
      <Reviews />
      <Chat />
      <ContactUs />
    </>
  );
};

export default LandingPage;
