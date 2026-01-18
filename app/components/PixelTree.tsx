"use client";

import React, { useEffect } from "react";

type TreeStage = "seed" | "sprout" | "sapling" | "tree";

export function PixelTree({ stage }: { stage: TreeStage }) {
  const map = {
    seed: "🌰",
    sprout: "🌱",
    sapling: "🌿",
    tree: "🌳",
  };

  const getScale = () => {
    switch (stage) {
      case "seed":
        return 0.8;
      case "sprout":
        return 0.95;
      case "sapling":
        return 1.05;
      case "tree":
        return 1.2;
    }
  };

  useEffect(() => {
    // Add animation to globals.css via style
    const style = document.createElement("style");
    style.textContent = `
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
      }
    `;
    if (typeof document !== "undefined") {
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
      style={{
        fontSize: "clamp(80px, 20vw, 140px)",
        margin: "clamp(16px, 2vh, 32px) 0",
        animation: "bounce 2s ease-in-out infinite",
        transform: `scale(${getScale()})`,
        transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        filter:
          stage === "tree"
            ? "drop-shadow(0 0 15px rgba(106, 194, 74, 0.5))"
            : "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "clamp(100px, 25vh, 180px)",
        maxWidth: "90vw",
      }}
    >
      {map[stage]}
    </div>
  );
}
