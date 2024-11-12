import { Typography, CardContent } from "@mui/material";

// TODO: FIX HEIGHT
interface SingleValueTemplateProps {
  value: number;
  title: string;
}

const SingleValueTemplate: React.FC<SingleValueTemplateProps> = ({
  title,
  value,
}) => {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          style={{
            marginBottom: 0,
            wordWrap: "break-word",
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
      </CardContent>

      <CardContent
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          style={{
            marginBottom: 0,
            wordWrap: "break-word",
            textAlign: "center",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </div>
  );
};

export default SingleValueTemplate;