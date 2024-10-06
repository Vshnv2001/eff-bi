import Hero from "../components/Hero/Hero";
import AboutUs from "../components/AboutUs/AboutUs";
import Steps from "../components/Steps/Steps";
import Display from "../components/Display/Display";
import Features from "../components/Features/Features";
import Reviews from "../components/Reviews/Reviews";
import Chat from "../components/Footer/Chat";
import ContactUs from "../components/Footer/ContactUs";
import BarChart from "../components/Charts/BarChart";
import PieChart from "../components/Charts/PieChart";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const LandingPage = () => {
  const sessionContext = useSessionContext();

  if (sessionContext.loading === true) {
    return null;
  }

  const chartWidth = 500;
  const chartHeight = 300;

  const data = [
    { label: "A", value: 10 },
    { label: "B", value: 10 },
    { label: "C", value: 10 },
    { label: "D", value: 10 },
    { label: "E", value: 10 },
    { label: "F", value: 10 },
    { label: "G", value: 10 },
    { label: "H", value: 10 },
    
  ];

  const width = 400; // Set the width of the chart
  const height = 400; // Set the height of the char

  return (
    <div>
      <div>
        <h1>My Bar Chart</h1>
        <BarChart width={chartWidth} height={chartHeight} events={true} />

        <h1>Browser Usage Pie Chart</h1>
        <div style={{ width: "400px", height: "400px" }}>
          <PieChart width={400} height={400} data={data} />
        </div>
      </div>
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
