import React from 'react';
import ImageComponent from './ImageComponent';
import ExploreButton from './ExploreButton';

const Features: React.FC = () => {
  const images = [
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/fce1dd55f0f2c9c81a0b9812b0b2da8cdda3dfe4c5ab76cd7e04bad5bc046586?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d", alt: "Upload view export illustration 1" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/112c6c7ce8a6ce770953a0aca32b72d51280c62d08aecf9b1707cf001224a9f3?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d", alt: "Upload view export illustration 2" },
    { src: "https://cdn.builder.io/api/v1/image/assets/TEMP/dcb30ab245a1b8b4d7d5357498a944e86bcb584d605d5c937e31c6cbf6675a8e?placeholderIfAbsent=true&apiKey=605ddb38b3184de6b494a658ff50786d", alt: "Upload view export illustration 3" }
  ];

  return (
    <main className="overflow-hidden px-16 py-16 bg-white max-md:px-5">
      <div className="flex gap-5 max-md:flex-col">
        <section className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
            <div className="flex flex-col w-full text-2xl font-black max-md:max-w-full">
              <h1 className="text-7xl leading-[88px] text-neutral-800 max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
                Upload. <br /> View. <br /> Export.
              </h1>
              <p className="mt-6 text-neutral-800 text-opacity-80 max-md:max-w-full">
                Upload your Google Sheets or CSV file, or provide a link to your database URI. Type your natural language prompt, view the generated SQL query, and export the relevant data visualisations.
              </p>
              <ExploreButton />
            </div>
            <ImageComponent src={images[0].src} alt={images[0].alt} className="self-end mt-0 max-w-full w-[316px] max-md:mr-0.5" />
          </div>
        </section>
        <section className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
            <div className="ml-4 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col">
                <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                  <ImageComponent src={images[1].src} alt={images[1].alt} className="grow mt-52 max-md:mt-10" />
                </div>
                <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                  <ImageComponent src={images[2].src} alt={images[2].alt} className="max-md:mt-6" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Features;