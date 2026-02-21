import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-brand-beige backdrop-blur sticky top-0 z-50 border-b border-black/5 py-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
        {/* Logo - centered on mobile, left on desktop */}
        <div className="flex justify-center md:justify-start items-center w-full md:w-auto mb-2 md:mb-0">
          <Link href="/" className="cursor-pointer">
            <Image src="/logo.png" alt="OAT & MATCHA Logo" width={120} height={40} priority />
          </Link>
        </div>
        {/* Nav Links - center */}
        <nav className="w-full md:w-auto flex justify-center order-2 md:order-none">
          <ul className="flex gap-6 list-none font-brand">
            <li><a href="#" className="text-zinc-900 font-medium hover:text-brand-green">Bowls</a></li>
            <li><a href="#" className="text-zinc-900 font-medium hover:text-brand-green">Matcha</a></li>
            <li><a href="#" className="text-zinc-900 font-medium hover:text-brand-green">Contact</a></li>
            <li><a href="#" className="text-zinc-900 font-medium hover:text-brand-green">Pop-ups</a></li>
          </ul>
        </nav>
        {/* Order Online CTA - right */}
        <div className="w-full md:w-auto flex justify-center md:justify-end order-3 md:order-none">
          <a href="/order" className="bg-brand-green text-white px-5 py-2 rounded-full font-semibold hover:bg-brand-green-hover transition">Order Online</a>
        </div>
      </div>
    </header>
  );
}
