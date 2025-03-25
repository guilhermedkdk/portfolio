import { techCardsItems } from "@/_libs/constants";

import TechCard from "./TechCard";

export default function Skills() {
  return (
    <div className="z-10 py-24">
      <div className="mb-10 space-y-4">
        <h1 className="text-5xl font-bold text-stone-200">Tecnologias</h1>
        <p className="max-w-3xl text-sm text-stone-200/70">
          Possuo experiência em diversas tecnologias modernas que me permitem
          criar soluções altamente funcionais.
          <br />
          Estas são algumas das minhas principais competências:
        </p>
      </div>

      <div className="grid grid-cols-1 items-center justify-between gap-4 min-[800px]:grid-cols-2 min-[1180px]:grid-cols-4">
        {techCardsItems.map((cardItem) => (
          <TechCard key={cardItem.name} cardInfo={cardItem} />
        ))}
      </div>
    </div>
  );
}
