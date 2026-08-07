import React from "react";

export function Stitch() {
  const dashes = Array.from({ length: 40 });
  return (
    <div className="stitch" aria-hidden="true">
      {dashes.map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

export function Loading({ label = "Loading…" }) {
  return <div className="loading">{label}</div>;
}

export function Empty({ label = "Nothing here yet." }) {
  return <div className="empty">{label}</div>;
}

export function Lightbox({ src, alt, onClose }) {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,13,11,0.92)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflow: "auto",
        cursor: "zoom-out",
      }}
    >
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "contain",
          cursor: "default",
        }}
      />
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed",
          top: 20,
          right: 24,
          background: "transparent",
          border: "1px solid #fff",
          color: "#fff",
          width: 40,
          height: 40,
          borderRadius: "50%",
          fontSize: 20,
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}
