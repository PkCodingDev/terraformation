"use client";

import React from "react";

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div
      style={{
        width: "clamp(250px, 80vw, 320px)",
        margin: "clamp(10px, 2vh, 20px) auto",
        padding: "clamp(8px, 1.5vw, 12px)",
        background: "#5fbf3c",
        border: "4px solid #2e7d32",
        borderRadius: "0",
        boxShadow:
          "4px 4px 0 rgba(0, 0, 0, 0.3), inset 0 4px 0 rgba(255, 255, 255, 0.2)",
      }}
    >
      <div
        style={{
          height: "clamp(18px, 3vh, 24px)",
          background: "#c8e6c9",
          border: "2px solid #2e7d32",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: "linear-gradient(to bottom, #7ee081, #4caf50)",
            transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: "inset 1px 1px 0 rgba(255, 255, 255, 0.4)",
          }}
        />
      </div>
      <div
        style={{
          fontSize: "clamp(0.5rem, 1.5vw, 0.7rem)",
          marginTop: "8px",
          color: "#1f3b1f",
          fontWeight: "bold",
          textShadow: "1px 1px 0 rgba(255, 255, 255, 0.6)",
        }}
      >
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
}
