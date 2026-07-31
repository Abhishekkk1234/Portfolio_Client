import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArtisticElement } from "../api/client";
import { Loading, Empty, Stitch } from "../components/Bits";

export default function ElementDetail() {
  const { id } = useParams();
  const [element, setElement] = useState(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    setElement(null);
    setError(false);
    setTab("all");
    getArtisticElement(id)
      .then(setElement)
      .catch(() => setError(true));
  }, [id]);

  if (error) return <Empty label="Piece not found." />;
  if (!element) return <Loading />;

  const images = element.images || [];
  const filtered =
    tab === "all"
      ? images
      : images.filter((img) => (tab === "photoshoot" ? img.is_photoshoot : !img.is_photoshoot));

  return (
    <section className="wrap" style={{ paddingTop: 50, paddingBottom: 100 }}>
      <Link to={`/collections/${element.collection_slug}`} className="eyebrow" style={{ display: "inline-block" }}>
        ← {element.collection_title}
      </Link>
      <h1 style={{ fontSize: "clamp(34px,5vw,58px)", marginTop: 14 }}>{element.title}</h1>
      {element.description && (
        <p className="detail-story" style={{ marginTop: 18 }}>{element.description}</p>
      )}
      {element.material && (
        <div className="detail-fact" style={{ marginTop: 20 }}>
          Materials<b>{element.material}</b>
        </div>
      )}

      <div style={{ margin: "36px 0" }}><Stitch /></div>

      <div className="photo-tabs">
        {["all", "look", "photoshoot"].map((t) => (
          <button
            key={t}
            className={`photo-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "all" ? "All Photos" : t === "look" ? "Look Shots" : "Photoshoot"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty label="No photos for this piece yet." />
      ) : (
        <div className="masonry">
          {filtered.map((img) => (
            <img key={img.id} src={img.image} alt={img.caption || element.title} loading="lazy" />
          ))}
        </div>
      )}
    </section>
  );
}
