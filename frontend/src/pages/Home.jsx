import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCraftHighlights, getCollections } from "../api/client";
import { Stitch, Loading, Empty } from "../components/Bits";

export default function Home({ designer }) {
  const [crafts, setCrafts] = useState(null);
  const [collections, setCollections] = useState(null);

  useEffect(() => {
    getCraftHighlights().then(setCrafts).catch(() => setCrafts([]));
    getCollections().then(setCollections).catch(() => setCollections([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">
              {designer?.location || "Studio"} · Est. {designer?.founded_year || "—"}
            </span>
            <h1>{designer?.name || "Loading…"}</h1>
            <p className="hero-copy">
              {designer?.home_intro ||
                (designer === null
                  ? "Connecting to the studio…"
                  : "Add a home page introduction from the admin panel.")}
            </p>
            <div style={{ marginTop: 30, display: "flex", gap: 14 }}>
              <Link to="/collections" className="btn btn-solid">View Collections</Link>
              <Link to="/about" className="btn">About the Designer</Link>
            </div>
          </div>
          <div className="hero-image">
            {designer?.portrait && <img src={designer.portrait} alt={designer.name} />}
          </div>
        </div>
      </section>

      <div className="wrap"><Stitch /></div>

      <section className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Craft</span>
            <h2>How each piece is made</h2>
          </div>
        </div>
        {/* /* <div className="section-head">
          <div>
            <span className="eyebrow">Craft</span>
            <h2>How each piece is made</h2>
          </div>
          <p className="section-note">
            Every technique used in the studio, documented in the artisans' own hands.
          </p>
        </div> */ }
        {crafts === null && <Loading />}
        {crafts && crafts.length === 0 && <Empty label="Add craft highlights from the admin panel." />}
        {crafts && crafts.length > 0 && (
          <div className="craft-grid">
            {crafts.map((c) => (
              <div className="craft-card" key={c.id}>
                <div className="craft-img">
                  <img src={c.image} alt={c.title} loading="lazy" />
                </div>
                <div className="craft-title">{c.title}</div>
                <div className="craft-desc">{c.description}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Collections</span>
            <h2>Eight collections</h2>
          </div>
          <Link to="/collections" className="btn">See all</Link>
        </div>
        {collections === null && <Loading />}
        {collections && collections.length === 0 && (
          <Empty label="Add your first collection from the admin panel." />
        )}
        {collections && collections.length > 0 && (
          <div className="collections-grid">
            {collections.slice(0, 4).map((c, i) => (
              <Link className="collection-card" to={`/collections/${c.slug}`} key={c.id}>
                <span className="collection-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="collection-img">
                  <img src={c.cover_image} alt={c.title} loading="lazy" />
                </div>
                <h3 className="collection-title">{c.title}</h3>
                <div className="collection-meta">
                  <span>{c.genre}</span>
                  {c.season_year && <span>{c.season_year}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
