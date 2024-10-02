import { AdvertiseButton } from "./AdvertiseButton";

interface AdvertiseDataProps {
  title: string;
  description: string;
  buttonText: string;
}

export const AdvertiseData: React.FC<AdvertiseDataProps> = ({
  title,
  description,
  buttonText,
}) => {
  return (
    <main className="flex relative flex-col justify-center items-center px-20 py-80 min-h-[1159px] text-zinc-950 max-md:px-5 max-md:py-24">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/260abb205a2481b33044adc8533a67e65891be68db3a8f4d22175aeaaabc62a1?placeholderIfAbsent=true&apiKey=256a9c011492495e88bbd0a1ad955fbe"
        alt=""
        className="object-cover absolute inset-0 size-full"
      />
      <section className="flex relative flex-col justify-center items-center max-w-full w-[676px]">
        <h1 className="text-7xl font-bold tracking-wider text-center max-md:max-w-full max-md:text-4xl">
          {title}
        </h1>
        <p className="mt-8 text-2xl leading-8 text-center max-md:max-w-full">
          {description}
        </p>
        <AdvertiseButton text={buttonText} />
      </section>
    </main>
  );
};
