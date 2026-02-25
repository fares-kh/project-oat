import "./styles.css";

interface SpecialCardProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
}

export default function SpecialCard({ title, imageSrc, imageAlt }: SpecialCardProps) {
  return (
    <div className="special-card">
      <div className="special-card-image">
        <img src={imageSrc} alt={imageAlt} />
      </div>
      <div className="special-card-content">
        <h3 className="special-card-title">{title}</h3>
      </div>
    </div>
  );
}
