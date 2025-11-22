"use client";
import dynamic from "next/dynamic";

const HeroVideo = dynamic(() => import("./HeroVideo"), { ssr: false });

export default function HeroVideoWrapper() {
  return <HeroVideo />;
}