import React from 'react';

interface TextSectionProps {
  title: string;
  description: string;
}

const TextSection: React.FC<TextSectionProps> = ({ title, description }) => {
  return (
    <section className="flex flex-col self-stretch my-auto max-md:mt-10 max-md:max-w-full">
      <h2 className="text-white z-10 mt-0 text-4xl font-medium leading-none text-slate-900 max-md:mr-0 max-md:max-w-full">
        {title}
      </h2>
      <p className="text-white z-10 mt-4 text-base leading-7 text-slate-900 max-md:mr-2.5 max-md:max-w-full">
        {description}
      </p>
    </section>
  );
};

export default TextSection;