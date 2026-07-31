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
