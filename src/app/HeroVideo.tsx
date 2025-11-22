"use client";
import { useRef, useEffect } from "react";

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
      className="absolute inset-0 w-full h-full object-cover z-0"
      src="/hero_video.mp4"
      autoPlay
      loop
      muted
      playsInline
  style={{ objectFit: 'cover', objectPosition: 'center 70%', width: '100%', height: '100%' }}
      poster="/hero2.jpg"
    />
  );
}