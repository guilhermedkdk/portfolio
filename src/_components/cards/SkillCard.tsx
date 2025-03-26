import Image from "next/image";

export default function SkillCard({
  cardInfo,
}: {
  cardInfo: {
    name: string;
    description: string;
    imageUrl: string;
    bgColor: string;
  };
}) {
  const { name, description, imageUrl, bgColor } = cardInfo;

  return (
    <div className="border-dark-200 bg-dark-200 hover:bg-dark-300 hover:border-dark-700 flex flex-1 gap-5 rounded-xl border p-2.5 transition-colors duration-200">
      <div className={`p-3 ${bgColor} w-fit rounded-lg`}>
        <Image
          src={imageUrl}
          width={32}
          height={32}
          alt={`${name} logo`}
          className="size-8"
        />
      </div>
      <div>
        <h4 className="text-lg font-medium">{name}</h4>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </div>
  );
}
