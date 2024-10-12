import { Card, Box } from '@mui/material';

interface ImageItemProps {
  src: string;
  alt: string;
}

const ImageItem: React.FC<ImageItemProps> = ({ src, alt }) => {
  return (
    <div className="flex flex-col min-w-[240px] w-[316px]">
      <Card
        sx={{
          boxShadow: 3, // Material-UI shadow level
          borderRadius: 2, // Equivalent to Tailwind's rounded-2xl
          overflow: 'hidden', // Ensures image doesn't overflow
        }}
      >
        <Box
          component="img"
          loading="lazy"
          src={src}
          alt={alt}
          sx={{
            objectFit: 'contain',
            width: '100%',
            aspectRatio: '1.1', // Matches the aspect-[1.1] class in Tailwind
          }}
        />
      </Card>
    </div>
  );
};

export default ImageItem;
