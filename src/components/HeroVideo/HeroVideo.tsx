"use client";
import { useRef, useEffect } from "react";
import "./styles.css";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover z-0 hero-video"
      src="/hero_video.mp4"
      autoPlay
      loop
      muted
      playsInline
      poster="/hero2.jpg"
    />
  );
}