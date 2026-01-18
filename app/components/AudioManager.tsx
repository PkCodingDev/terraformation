"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

export interface AudioManagerHandle {
  playTreeCompleteSound: () => void;
}

export const AudioManager = forwardRef<AudioManagerHandle, {}>(({}, ref) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgAudioRef = useRef<GainNode | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const bgLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)();

          // Create master gain for background music
          const masterGain = audioContextRef.current.createGain();
          masterGain.connect(audioContextRef.current.destination);
          masterGain.gain.value = 0.15;
          bgAudioRef.current = masterGain;
        }

        // Start background music loop
        playBackgroundMusicLoop();
      } catch (err) {
        console.log("Audio context not available");
      }
    };

    initAudio();

    return () => {
      if (bgLoopRef.current) clearInterval(bgLoopRef.current);
    };
  }, []);

  const playBackgroundMusicLoop = () => {
    if (bgLoopRef.current) clearInterval(bgLoopRef.current);

    const playSequence = () => {
      if (!audioContextRef.current || !bgAudioRef.current) return;

      const ctx = audioContextRef.current;
      const now = ctx.currentTime;

      // Calming lofi progression: Am - F - C - G (relaxing jazz chord progression)
      const lofiChords = [
        [220, 261.63, 329.63], // Am
        [174.61, 261.63, 329.63], // F
        [130.81, 196.0, 261.63], // C
        [196.0, 246.94, 329.63], // G
      ];

      let currentTime = now;

      // Play the progression twice with gentle bass and pad
      for (let pass = 0; pass < 2; pass++) {
        lofiChords.forEach((chord, chordIdx) => {
          chord.forEach((freq, noteIdx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.frequency.value = freq;
            osc.type = noteIdx === 0 ? "sine" : "triangle"; // Bass sine, pads triangle
            osc.frequency.setTargetAtTime(freq, currentTime, 0.1); // Smooth pitch bend

            const duration = 6; // Long held notes for lofi vibe
            gain.gain.setValueAtTime(0, currentTime);
            gain.gain.linearRampToValueAtTime(
              0.03 - noteIdx * 0.005,
              currentTime + 0.3
            );
            gain.gain.linearRampToValueAtTime(
              0.02 - noteIdx * 0.004,
              currentTime + duration - 0.5
            );
            gain.gain.linearRampToValueAtTime(0, currentTime + duration);

            osc.connect(gain);
            gain.connect(bgAudioRef.current!);

            osc.start(currentTime);
            osc.stop(currentTime + duration);
          });

          currentTime += 6;
        });
      }
    };

    playSequence();
    bgLoopRef.current = setInterval(playSequence, 48000); // 48 second loop (4 chords × 6 sec × 2 passes)
  };

  // Expose tree complete sound to parent via ref
  useImperativeHandle(ref, () => ({
    playTreeCompleteSound: () => {
      if (!audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const now = ctx.currentTime;
      const notes = [392, 440, 494]; // G, A, B

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.value = freq;
        osc.type = "sine";

        const startTime = now + idx * 0.1;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    },
  }));

  const toggleMute = () => {
    if (bgAudioRef.current) {
      bgAudioRef.current.gain.value = isMuted ? 0.15 : 0;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 100,
      }}
    >
      <button
        onClick={toggleMute}
        style={{
          padding: "8px 12px",
          fontSize: "0.7rem",
          background: isMuted ? "#999" : "#7cb342",
          border: "2px solid " + (isMuted ? "#666" : "#558b2f"),
          color: "#fff",
          cursor: "pointer",
          borderRadius: "0",
          boxShadow: "2px 2px 0 #000",
          fontFamily: "Press Start 2P",
          transition: "all 0.2s",
        }}
      >
        {isMuted ? "🔇 Muted" : "🎵 Music"}
      </button>
    </div>
  );
});

AudioManager.displayName = "AudioManager";
