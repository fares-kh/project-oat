import MenuItem from './MenuItem';

interface MenuItemData {
  title: string;
  description: string;
}

interface MenuColumnProps {
  title: string;
  items: MenuItemData[];
}

export default function MenuColumn({ title, items }: MenuColumnProps) {
  return (
    <div className="p-8 rounded-2xl bg-background shadow-lg menu-column">
      <h3
        className="text-xl font-bold mb-6 text-brand-green pb-4 border-b border-brand-border font-brand"
      >
        {title}
      </h3>
      {items.map((item, index) => (
        <MenuItem key={index} title={item.title} description={item.description} />
      ))}
    </div>
  );
}
