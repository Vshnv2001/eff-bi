import { Card, Typography } from "@mui/material";

interface SingleValueTemplateProps {
  value: number;
  title: string;
  id: number;
}

const SingleValueTemplate: React.FC<SingleValueTemplateProps> = ({
  title,
  value,
  id,
}) => {
  return (
    <div className="relative mt-30">
      <Typography variant="h6" className="text-center text-black mb-10">
        {title}
      </Typography>

      <Card
        className="py-5 rounded-lg"
        style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", padding: 20 }}
      >
        <Typography variant="h1" className="text-center mt-4">
          {value}
        </Typography>
      </Card>
    </div>
  );
};

export default SingleValueTemplate;
