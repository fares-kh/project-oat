"use client";
import dynamic from "next/dynamic";
import "./styles.css";

const HeroVideo = dynamic(() => import("./HeroVideo"), { ssr: false });

export default function HeroVideoWrapper() {
  return (
    <>
      <HeroVideo />
      <div className="hero-overlay" />
      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="text-text-white">
          The UK's only b.y.o oat bowl & iced matcha
        </h1>
        <a href="/order" className="bg-brand-green text-text-white px-8 py-3 rounded-full font-semibold text-lg shadow hover:bg-brand-green-hover transition">Create Your Bowl</a>
      </div>
    </>
  );
}