import Image from "next/image";

interface NutritionSnippet {
  energy_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface MenuItemProps {
  title: string;
  description: string;
  image?: string;
  nutrition?: NutritionSnippet;
}

export default function MenuItem({ title, description, image, nutrition }: MenuItemProps) {
  return (
    <div className="menu-item py-4 border-b border-dashed last:border-b-0 flex items-center gap-4">
      {image && (
        <div className="shrink-0">
          <Image
            src={image}
            alt={title}
            width={72}
            height={72}
            className="rounded-xl object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h4
          className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full font-brand-tight text-text-dark"
        >
          {title}
        </h4>
        <p className="italic text-base">{description}</p>
        {nutrition && (
          <p className="mt-1 text-xs text-zinc-500 font-medium tracking-wide">
            Kcal: {nutrition.energy_kcal} &nbsp;·&nbsp; P: {nutrition.protein_g}g &nbsp;·&nbsp; C: {nutrition.carbs_g}g &nbsp;·&nbsp; F: {nutrition.fat_g}g
          </p>
        )}
      </div>
    </div>
  );
}
