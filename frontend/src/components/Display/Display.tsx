import Header from "./Header";
import ImageGrid from "./ImageGrid";
import FadeIn from "../Animations/FadeIn";

const Display: React.FC = () => {
  return (
    <main className="flex overflow-hidden flex-col p-16 bg-[#f0f2fe] max-md:px-5">
      <Header />
      <FadeIn>
        <ImageGrid />
      </FadeIn>
    </main>
  );
};

export default Display;
