import React from 'react';
import LaptopDisplay from './LaptopDisplay';
import TextSection from './TextSection';

const Steps: React.FC = () => {
  return (
    <main className="flex flex-col items-center bg-black">
      {/* First Section */}
      <section className="w-full max-w-[1240px] p-5">
        <div className="flex gap-5 max-md:flex-col items-center">
          <div className="flex flex-col justify-center w-1/2 max-md:w-full">
            <TextSection
              title="Type what you need in the chatbot"
              description="Our system uses a lightweight NLP engine to process your natural language inputs into SQL queries and visualizations. With advanced parsing, we streamline complex data requests."
            />
          </div>
          <div className="flex flex-col w-1/2 max-md:w-full">
            <LaptopDisplay content={<div />} label="Macbook Pro" />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/42866618a61135ec34a135b5fd2a5e7144ecc8563c8943a30c69a8fafa7aed1a"
              alt="Laptop Display"
              className="object-contain mt-4 rounded-lg max-w-full"
            />
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section className="w-full max-w-[1240px] mt-10 p-5">
        <div className="flex gap-5 max-md:flex-col items-center">
          <div className="flex flex-col w-1/2 max-md:w-full">
            <LaptopDisplay content={<div />} label="Macbook Pro" />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/58ffa963ddbd8f0bf14892b4f86c86dcb843c21e7c60c42787ae1b8723a0e9a7"
              alt="Laptop Display"
              className="object-contain mt-4 rounded-lg max-w-full"
            />
          </div>
          <div className="flex flex-col justify-center w-1/2 max-md:w-full">
            <TextSection
              title="View and edit the SQL output"
              description="Review and modify the generated SQL query in the console. After changes, click 'Run' to update data visualizations instantly, with real-time validation."
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Steps;