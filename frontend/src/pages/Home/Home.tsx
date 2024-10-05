import SuccessView from "./SuccessView";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import Hero from "../../components/Hero/Hero";
import AboutUs from "../../components/AboutUs/AboutUs";
import Steps from "../../components/Steps/Steps";
import Display from "../../components/Display/Display";
import Features from "../../components/Features/Features";
import Reviews from "../../components/Reviews/Reviews";
import Advertise from "../../components/Advertise/Advertise";

export default function Home() {
  const sessionContext = useSessionContext();

  if (sessionContext.loading === true) {
    return null;
  }

  return (
    <div className="fill" id="home-container">
            <SuccessView userId={sessionContext.userId} />
            <Hero />
      <AboutUs />
      <Steps />
      <Display />
      <Features />
      <Reviews />
      <Advertise />
    </div>
  );
}

/*
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
      <Advertise />
    </div>
  );
};

export default LandingPage;
*/
