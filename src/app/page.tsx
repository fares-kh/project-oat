
function Header() {
  return (
    <header className="bg-[#e7e1c9] backdrop-blur sticky top-0 z-50 border-b border-black/5 py-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
        {/* Logo - centered on mobile, left on desktop */}
        <div className="flex justify-center md:justify-start items-center w-full md:w-auto mb-2 md:mb-0">
          <Image src="/logo.png" alt="OAT & MATCHA Logo" width={120} height={40} priority />
        </div>
        {/* Nav Links - center */}
        <nav className="w-full md:w-auto flex justify-center order-2 md:order-none">
          <ul className="flex gap-6 list-none">
            <li><a href="#" className="text-zinc-900 font-medium hover:text-[#9e9b65]" style={{ fontFamily: 'Futura, sans-serif' }}>Bowls</a></li>
            <li><a href="#" className="text-zinc-900 font-medium hover:text-[#9e9b65]" style={{ fontFamily: 'Futura, sans-serif' }}>Matcha</a></li>
            <li><a href="#" className="text-zinc-900 font-medium hover:text-[#9e9b65]" style={{ fontFamily: 'Futura, sans-serif' }}>Contact</a></li>
            <li><a href="#" className="text-zinc-900 font-medium hover:text-[#9e9b65]" style={{ fontFamily: 'Futura, sans-serif' }}>Pop-ups</a></li>
          </ul>
        </nav>
        {/* Order Online CTA - right */}
        <div className="w-full md:w-auto flex justify-center md:justify-end order-3 md:order-none">
          <a href="#" className="bg-[#9e9b65] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#7c7a4e] transition">Order Online</a>
        </div>
      </div>
    </header>
  );
}


import Image from "next/image";
import HeroVideoWrapper from "./HeroVideoWrapper";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e7e1c9] font-sans dark:bg-black">
      <Header />
      <section className="w-full py-0 bg-[#e7e1c9] relative min-h-[400px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Hero Video Background as Client Component */}
  <HeroVideoWrapper />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/20 z-10" />
        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 py-24 flex flex-col items-start text-left gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tighter drop-shadow-lg" style={{ fontFamily: 'Futura, sans-serif', letterSpacing: '-0.08em' }}>
            The UK’s only b.y.o oat bowl & iced matcha
          </h1>
          <a href="#" className="bg-[#9e9b65] text-white px-8 py-3 rounded-full font-semibold text-lg shadow hover:bg-[#7c7a4e] transition">Create Your Bowl</a>
        </div>

      </section>

      {/* November Specials Section */}
  <section className="py-24 bg-zinc-100 relative overflow-hidden">
        {/* Faint coffee overlay, behind all content */}
        <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 section-title tracking-tighter text-black" style={{ fontFamily: 'Futura, sans-serif', letterSpacing: '-0.08em', color: '#000' }}>
              November Specials
            </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center specials-grid md:flex-nowrap md:overflow-x-auto" style={{ minWidth: '0' }}>
            {/* Blueberry Cheesecake Oat Bowl - Polaroid Style, full content */}
            <div className="bg-white rounded-lg special-card flex flex-col items-center pb-4 pt-4 px-4" style={{ boxShadow: '0 16px 32px -8px rgba(0,0,0,0.18)', borderRadius: '18px', border: '1.5px solid #e7e1c9', maxWidth: 340, background: '#fff' }}>
              <div className="w-full flex justify-center items-center" style={{ background: '#f5f5f5', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', height: '260px', minHeight: '260px', maxHeight: '260px' }}>
                <img src="/nov_1.png" alt="Blueberry Cheesecake Oat Bowl" className="object-contain rounded-lg" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
              </div>
              <div className="w-full flex flex-col items-start mt-4 special-content flex-1">
                <h3 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Blueberry Cheesecake Oat Bowl</h3>
                <div className="font-bold text-[#9e9b65] text-lg special-price">£4.95</div>
              </div>
            </div>
            {/* Toasted Marshmallow Matcha - Polaroid Style, full content */}
            <div className="bg-white rounded-lg special-card flex flex-col items-center pb-4 pt-4 px-4" style={{ boxShadow: '0 16px 32px -8px rgba(0,0,0,0.18)', borderRadius: '18px', border: '1.5px solid #e7e1c9', maxWidth: 340, background: '#fff' }}>
              <div className="w-full flex justify-center items-center" style={{ background: '#f5f5f5', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', height: '260px', minHeight: '260px', maxHeight: '260px' }}>
                <img src="/nov_2.png" alt="Toasted Marshmallow Matcha" className="object-contain rounded-lg" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }} />
              </div>
              <div className="w-full flex flex-col items-start mt-4 special-content flex-1">
                <h3 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Toasted Marshmallow Matcha</h3>
                <div className="font-bold text-[#9e9b65] text-lg special-price">£5.95</div>
              </div>
            </div>
          </div>
        </div>
      </section>
            {/* Full-width hero2 image between specials and menu */}
      <div className="w-full">
        <img src="/hero2.jpg" alt="Oat & Matcha" className="w-full object-cover" style={{ maxHeight: '420px', width: '100%' }} />
      </div>

      {/* Menu Section - styled like sample_code.tsx */}
      <section className="py-24 bg-white menu-section">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 section-title tracking-tighter text-black" style={{ fontFamily: 'Futura, sans-serif', letterSpacing: '-0.08em' }}>
            Menu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 menu-grid">
            {/* Oat Bowls Column */}
            <div className="p-8 rounded-2xl bg-white shadow-lg menu-column">
              <h3 className="text-xl font-bold mb-6 text-[#9e9b65] pb-4 border-b border-[#D7C9B0]" style={{ fontFamily: 'Futura, sans-serif' }}>OAT BOWLS</h3>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Sticky Toffee</h4>
                <p className="italic text-zinc-500 text-base">Toffee sauce, caramelized banana, oat crumble</p>
              </div>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Apple of my Eye</h4>
                <p className="italic text-zinc-500 text-base">Stewed apple, cinnamon, almond butter, oat base</p>
              </div>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Blueberry Cheesecake</h4>
                <p className="italic text-zinc-500 text-base">Blueberry compote, cheesecake crumble, lemon zest</p>
              </div>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Plant based Coconut</h4>
                <p className="italic text-zinc-500 text-base">Coconut yogurt, mango, chia, oat base</p>
              </div>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Dairy Bowl</h4>
                <p className="italic text-zinc-500 text-base">Greek yogurt, honey, berries, oat base</p>
              </div>
            </div>
            {/* Matcha Column */}
            <div className="p-8 rounded-2xl bg-white shadow-lg menu-column">
              <h3 className="text-xl font-bold mb-6 text-[#9e9b65] pb-4 border-b border-[#D7C9B0]" style={{ fontFamily: 'Futura, sans-serif' }}>MATCHA MENU</h3>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Banana Cream</h4>
                <p className="italic text-zinc-500 text-base">Banana, oat milk, vanilla, ceremonial matcha</p>
              </div>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Strawberry</h4>
                <p className="italic text-zinc-500 text-base">Strawberry purée, oat milk, ceremonial matcha</p>
              </div>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Iced Protein Matcha</h4>
                <p className="italic text-zinc-500 text-base">Vanilla protein, oat milk, ice, ceremonial matcha</p>
              </div>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Iced Toasted Marshmallow</h4>
                <p className="italic text-zinc-500 text-base">Toasted marshmallow syrup, oat milk, ice, matcha</p>
              </div>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>Cotton Cloud</h4>
                <p className="italic text-zinc-500 text-base">Vanilla, oat milk, ceremonial matcha, cloud foam</p>
              </div>
              <div className="menu-item py-4 border-b border-dashed last:border-b-0">
                <h4 className="text-2xl md:text-3xl font-extrabold mb-1 tracking-tighter text-left w-full" style={{ color: '#2D2D2D', letterSpacing: '-0.08em', fontFamily: 'Futura, sans-serif' }}>White Chocolate</h4>
                <p className="italic text-zinc-500 text-base">White chocolate, oat milk, ceremonial matcha</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer from sample_code.tsx */}
      <footer className="bg-[#F6F5EF] text-black pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 footer-content mb-10">
            <div className="footer-section flex flex-col items-start">
              <Image src="/logo.png" alt="OAT & MATCHA Logo" width={120} height={40} priority />
            </div>
            <div className="footer-section">
            </div>
            <div className="footer-section flex flex-col items-start">
              <h3 className="mb-4 text-xl font-bold" style={{ fontFamily: 'Futura, sans-serif', color: '#9e9b65' }}>Follow Us</h3>
              <div className="flex gap-4">
                <a href="https://www.tiktok.com/@yourbrand" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black hover:text-[#9e9b65] transition font-semibold" style={{ fontFamily: 'Futura, sans-serif' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tiktok" viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                  </svg>
                  TikTok
                </a>
                <a href="https://www.instagram.com/yourbrand" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black hover:text-[#9e9b65] transition font-semibold" style={{ fontFamily: 'Futura, sans-serif' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                </svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#bbb] pt-6 text-center text-black text-sm copyright" style={{ fontFamily: 'Futura, sans-serif' }}>
            &copy; 2025 Ellie's Oats. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
