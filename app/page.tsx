"use client";

import { useEffect, useState, useRef } from "react";
import { PixelTree } from "./components/PixelTree";
import { ProgressBar } from "./components/ProgressBar";
import { AudioManager } from "./components/AudioManager";

type TreeStage = "seed" | "sprout" | "sapling" | "tree";

export default function Home() {
  const [trees, setTrees] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<TreeStage>("seed");
  const prevTreesRef = useRef(0);
  const audioManagerRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/earnings");
      const data = await res.json();

      // Check if a new tree was completed
      if (data.trees > prevTreesRef.current) {
        // Play tree complete sound
        if (audioManagerRef.current?.playTreeCompleteSound) {
          audioManagerRef.current.playTreeCompleteSound();
        }
      }

      prevTreesRef.current = data.trees;
      setTrees(data.trees);
      setProgress(data.progress);
    };

    fetchData();
    const interval = setInterval(fetchData, 10_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 0.25) setStage("seed");
    else if (progress < 0.5) setStage("sprout");
    else if (progress < 0.75) setStage("sapling");
    else setStage("tree");
  }, [progress]);

  return (
    <main
      style={{
        padding: "clamp(20px, 5vw, 40px)",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <h1
        style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)", margin: "0 0 10px 0" }}
      >
        🌍 Terraformation
      </h1>

      <div
        style={{
          marginBottom: "clamp(10px, 2vh, 20px)",
          marginTop: "clamp(10px, 2vh, 20px)",
          fontSize: "clamp(0.65rem, 2vw, 0.9rem)",
          opacity: 0.8,
        }}
      >
        <p>{trees} Trees Planted</p>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100px",
        }}
      >
        <PixelTree stage={stage} />
      </div>

      <ProgressBar progress={progress} />

      <div
        style={{
          marginTop: "clamp(15px, 2vh, 20px)",
          marginBottom: "clamp(15px, 1.5vh, 20px)",
          fontSize: "clamp(0.55rem, 1.5vw, 0.7rem)",
          opacity: 0.7,
        }}
      >
        <p style={{ margin: 0, wordBreak: "break-all" }}>
          Contract: BBSAW49Sru7jiSajWVKTSWs39psrjjHbMMtWGWTJBAGS
        </p>
      </div>

      {/* Terra Button and Made by OxHimmel Section */}
      <div
        style={{
          marginBottom: "clamp(60px, 12vh, 100px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(15px, 2vh, 20px)",
        }}
      >
        {/* Terra Button */}
        <a
          href="https://x.com/TF_Global"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "clamp(12px, 3vw, 17px) clamp(24px, 4.8vw, 34px)",
            fontSize: "clamp(0.8rem, 2.4vw, 1.14rem)",
            background: "rgba(255, 255, 255, 0.1)",
            border: "3px solid #1f3b1f",
            color: "#1f3b1f",
            cursor: "pointer",
            borderRadius: "0",
            boxShadow: "3px 3px 0 #1f3b1f",
            fontFamily: "Press Start 2P",
            textDecoration: "none",
            display: "inline-block",
            transition: "all 0.2s",
            fontWeight: "bold",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = "translate(3px, 3px)";
            (e.target as HTMLElement).style.boxShadow = "0px 0px 0 #1f3b1f";
            (e.target as HTMLElement).style.background =
              "rgba(124, 179, 66, 0.2)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = "translate(0, 0)";
            (e.target as HTMLElement).style.boxShadow = "3px 3px 0 #1f3b1f";
            (e.target as HTMLElement).style.background =
              "rgba(255, 255, 255, 0.1)";
          }}
        >
          Terra
        </a>

        {/* Made by OxHimmel */}
        <a
          href="https://x.com/0xHimmel_"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "clamp(0.5rem, 1.2vw, 0.65rem)",
            color: "#1f3b1f",
            textDecoration: "none",
            borderBottom: "1px solid #7cb342",
            opacity: 0.7,
            transition: "opacity 0.2s",
            fontFamily: "Press Start 2P",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.opacity = "0.7";
          }}
        >
          Made by OxHimmel
        </a>
      </div>

      <AudioManager ref={audioManagerRef} />
    </main>
  );
}
