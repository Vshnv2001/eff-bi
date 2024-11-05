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
      <div className="text-center">
        <h1 className="mt-20 text-4xl font-bold text-center mb-4">
          Type in simple English, and the chart will be generated for you
        </h1>
      </div>
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
