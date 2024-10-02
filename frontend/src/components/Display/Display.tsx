import Header from "./Header";
import ImageGrid from "./ImageGrid";

const Display: React.FC = () => {
  return (
    <main className="flex overflow-hidden flex-col p-16 bg-white max-md:px-5">
      <Header />
      <ImageGrid />
    </main>
  );
};

export default Display;
