import React from "react";
import Image from "next/image";

export default function GitFutHero() {
  return (
    <div
      className="stagger-children"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        width: "100%",
        padding: "1rem 0",
      }}
    >
      <Image
        src="/-gitfut.png"
        alt="GitFut Score Card"
        width={80}
        height={40}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "220px",
          display: "block",
          objectFit: "contain",
        }}
        priority
      />
    </div>
  );
}
