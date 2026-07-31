import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCollections } from "../api/client";
import { Loading, Empty, Stitch } from "../components/Bits";

export default function Collections() {
  const [collections, setCollections] = useState(null);

  useEffect(() => {
    getCollections().then(setCollections).catch(() => setCollections([]));
  }, []);

  return (
    <section className="wrap" style={{ paddingTop: 60 }}>
      <span className="eyebrow">Archive</span>
      <h1 style={{ fontSize: "clamp(36px,5vw,64px)", marginBottom: 20 }}>All Collections</h1>
      <p className="section-note" style={{ maxWidth: 560, marginBottom: 20 }}>
        Eight collections, each built from a set of artistic elements — every
        piece documented in its finished form and mid-shoot.
      </p>
      <Stitch />

      {collections === null && <Loading />}
      {collections && collections.length === 0 && (
        <Empty label="Add collections from the admin panel to see them here." />
      )}
      {collections && collections.length > 0 && (
        <div className="collections-grid" style={{ marginTop: 40 }}>
          {collections.map((c, i) => (
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
              <p className="collection-desc">{c.short_description}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
