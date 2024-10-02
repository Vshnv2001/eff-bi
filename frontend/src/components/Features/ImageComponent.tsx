import React from 'react';

interface ImageComponentProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, alt, className }) => (
  <div className={`flex overflow-hidden relative flex-col rounded-3xl aspect-[0.725] ${className}`}>
    <img loading="lazy" src={src} alt={alt} className="object-cover absolute inset-0 size-full" />
    <img loading="lazy" src={src} alt={alt} className="object-contain w-full rounded-3xl aspect-[0.72]" />
  </div>
);

export default ImageComponent;