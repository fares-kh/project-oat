import "./styles.css";

interface SpecialCardProps {
  title: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
}

export default function SpecialCard({ title, price, imageSrc, imageAlt }: SpecialCardProps) {
  return (
    <div className="special-card">
      <div className="special-card-image">
        <img src={imageSrc} alt={imageAlt} />
      </div>
      <div className="special-card-content">
        <h3 className="special-card-title">{title}</h3>
        <div className="special-card-price">{price}</div>
      </div>
    </div>
  );
}
