import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/collections", label: "Collections" },
  { to: "/enquiry", label: "Enquiry" },
];

export default function Navbar({ studioName }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap">
        <NavLink to="/" className="nav-mark" onClick={() => setOpen(false)}>
          {studioName || "Studio"}
        </NavLink>
        <ul className={`nav-links ${open ? "open" : ""}`}>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "×" : "≡"}
        </button>
      </div>
    </header>
  );
}
