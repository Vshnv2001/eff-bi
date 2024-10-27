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
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
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
            aspectRatio: '1.1',
          }}
        />
      </Card>
    </div>
  );
};

export default ImageItem;
