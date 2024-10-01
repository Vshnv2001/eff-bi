interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
  }
  
  const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
      <article className="flex flex-col grow shrink pr-9 bg-blend-normal min-h-[107px] min-w-[240px] pb-[1509px] w-[328px] max-md:pb-24">
        <div className="flex gap-3 max-w-full text-lg font-medium tracking-normal leading-loose bg-blend-normal w-[375px]">
          <img loading="lazy" src={icon} alt="" className="object-contain shrink-0 my-auto w-5 bg-blend-normal aspect-square" />
          <h2 className="flex-auto w-[338px]">{title}</h2>
        </div>
        <p className="mt-2 max-w-full text-base leading-6 bg-blend-normal min-h-[72px] pb-[1592px] w-[375px] max-md:pb-24">
          {description}
        </p>
      </article>
    );
  };
  
  export default FeatureCard;