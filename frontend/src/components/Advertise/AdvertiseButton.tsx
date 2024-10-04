interface ButtonProps {
  text: string;
}

export const AdvertiseButton: React.FC<ButtonProps> = ({ text }) => {
  return (
    <button className="bg-black text-white overflow-hidden gap-2.5 px-14 py-6 mt-8 text-2xl font-medium leading-none text-white bg-zinc-950 rounded-[40px] max-md:px-5">
      {text}
    </button>
  );
};
