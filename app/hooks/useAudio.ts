import { useEffect, useRef } from "react";

export function useAudio() {
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const treeCompleteRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create background music audio element
    if (!bgMusicRef.current) {
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==";
      audio.loop = true;
      audio.volume = 0.15;
      bgMusicRef.current = audio;
      audio.play().catch(() => {}); // Ignore autoplay errors
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  const playTreeCompleteSound = () => {
    if (!treeCompleteRef.current) {
      const audio = new Audio();
      audio.src = "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==";
      audio.volume = 0.3;
      treeCompleteRef.current = audio;
    }
    treeCompleteRef.current.currentTime = 0;
    treeCompleteRef.current.play().catch(() => {});
  };

  return { playTreeCompleteSound };
}
