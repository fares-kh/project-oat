interface MenuItemProps {
  title: string;
  description: string;
}

export default function MenuItem({ title, description }: MenuItemProps) {
  return (
    <div className="menu-item py-4 border-b border-dashed last:border-b-0">
      <h4
        className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full font-brand-tight text-text-dark"
      >
        {title}
      </h4>
      <p className="italic text-base">{description}</p>
    </div>
  );
}
