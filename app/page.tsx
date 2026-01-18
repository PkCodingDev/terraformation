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
        padding: 40,
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Terraformation</h1>

      <div
        style={{
          marginBottom: 20,
          marginTop: 20,
          fontSize: "0.9rem",
          opacity: 0.8,
        }}
      >
        <p>{trees} Trees Planted</p>
      </div>

      <PixelTree stage={stage} />

      <ProgressBar progress={progress} />

      <div style={{ marginTop: 20, fontSize: "0.7rem", opacity: 0.7 }}>
        <p>Contract: BBSAW49Sru7jiSajWVKTSWs39psrjjHbMMtWGWTJBAGS</p>
      </div>

      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#1f3b1f",
            textShadow: "2px 2px 0 rgba(255, 255, 255, 0.6)",
          }}
        >
          𝕏
        </span>
        <a
          href="https://x.com/TF_Global"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "8px 16px",
            fontSize: "0.7rem",
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
      </div>

      <AudioManager ref={audioManagerRef} />

      {/* Made by credit */}
      <div
        style={{
          position: "fixed",
          bottom: 80,
          left: 20,
          fontSize: "0.65rem",
          opacity: 0.6,
        }}
      >
        <a
          href="https://x.com/0xHimmel_"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#000000ff",
            textDecoration: "none",
            borderBottom: "1px solid #7cb342",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.opacity = "0.6";
          }}
        >
          Made by OxHimmel
        </a>
      </div>
    </main>
  );
}
