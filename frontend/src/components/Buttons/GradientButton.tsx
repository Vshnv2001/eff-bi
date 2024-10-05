// import { Button } from "@material-tailwind/react";

interface GradientButtonProps {
  text: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({ text }) => {
  return (
    <div>
      <div className="flex items-center gap-4">
        {/* 
        <Button className="rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          {text}
        </Button>
        */}
      </div>
    </div>
  );
};

export default GradientButton;
