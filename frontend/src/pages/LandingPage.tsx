import Hero from "../components/Hero/Hero";
import AboutUs from "../components/AboutUs/AboutUs";
import Steps from "../components/Steps/Steps";
import Display from "../components/Display/Display";
import Features from "../components/Features/Features";
import Reviews from "../components/Reviews/Reviews";
import Chat from "../components/Footer/Chat";
import ContactUs from "../components/Footer/ContactUs";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const LandingPage = () => {
  const sessionContext = useSessionContext();

  if (sessionContext.loading === true) {
    return null;
  }

  return (
    <div>        

      <Hero />
      <AboutUs />
      <Steps />
      <Display />
      <Features />
      <Reviews />
      <Chat />
      <ContactUs />
    </div>
  );
};

export default LandingPage;
