import Image from "next/image";
import HeroVideoWrapper from "@/components/HeroVideo/HeroVideoWrapper";
import MenuColumn from "@/components/MenuColumn";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpecialCard from "@/components/SpecialCard/SpecialCard";
import { products } from "@/data/products";

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <section className="w-full py-0 relative min-h-[400px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        <HeroVideoWrapper />
      </section>

  <section className="py-24 relative bg-background overflow-hidden">
        <div className="container mx-auto px-6">
            <h2 className="mb-12">
              Monthly Specials
            </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center specials-grid md:flex-nowrap md:overflow-x-auto" style={{ minWidth: '0' }}>
            {products
              .filter(product => product.monthlySpecial)
              .map(product => (
                <SpecialCard
                  key={product.id}
                  title={product.name}
                  imageSrc={product.image}
                  imageAlt={product.name}
                />
              ))
            }
            <SpecialCard
              title="Mango Coconut Matcha"
              imageSrc="/monthly-special-matcha.png"
              imageAlt="Mango Coconut Matcha"
            />
          </div>
        </div>
      </section>
            {/* Full-width hero2 image between specials and menu */}
      <div className="w-full">
        <img src="/hero2.jpg" alt="Oat & Matcha" className="w-full object-cover" style={{ maxHeight: '420px', width: '100%' }} />
      </div>

      <section className="py-24 menu-section" id="menu">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 section-title tracking-tighter font-brand-tight">
            Menu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 menu-grid">
            <MenuColumn
              title="OAT BOWLS"
              items={products.map(product => ({
                title: product.name,
                description: product.description
              }))}
            />
            <MenuColumn
              title="MATCHA MENU"
              items={[
                { title: "Classic Ceremonial (vg)", description: "" },
                { title: "Vanilla (vg)", description: "" },
                { title: "Strawberry (vg)", description: "" },
                { title: "Banana Cream (vg)", description: "Banana matcha, banana cold foam" },
                { title: "Cotton Cloud", description: "White chocolate matcha, raspberry cold foam" },
                { title: "Vanilla Protein", description: "Vegan protein shake with a serving of matcha" },
                { title: "(Hot) Toasted Marshmallow", description: "" },
                { title: "(Hot) White Chocolate", description: "" },
              ]}
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
