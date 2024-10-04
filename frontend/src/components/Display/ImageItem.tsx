interface ImageItemProps {
  src: string;
  alt: string;
}

const ImageItem: React.FC<ImageItemProps> = ({ src, alt }) => {
  return (
    <div className="flex flex-col min-w-[240px] w-[316px]">
      <img
        loading="lazy"
        src={src}
        alt={alt}
        className="object-contain w-full rounded-2xl aspect-[1.1]"
      />
    </div>
  );
};

export default ImageItem;
