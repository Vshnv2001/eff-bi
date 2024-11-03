interface TextCardProps {
  icon: string;
  title: string;
  description: string;
}

const TextCard: React.FC<TextCardProps> = ({ icon, title, description }) => {
  return (
    <article className="flex flex-col grow shrink p-4 bg-blend-normal w-[328px]">
      <div className="flex gap-3 max-w-full text-lg font-medium tracking-normal leading-loose">
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="object-contain shrink-0 my-auto w-5 aspect-square"
        />
        <h2 className="flex-auto font-semibold">{title}</h2>
      </div>
      <p className="mt-2 text-base leading-6">
        {description}
      </p>
    </article>
  );
};

export default TextCard;