import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCollection } from "../api/client";
import { Loading, Empty, Stitch, Lightbox } from "../components/Bits";
// import { Loading, Empty, Stitch } from "../components/Bits";

export default function CollectionDetail() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    setCollection(null);
    setTab("all");
    getCollection(slug)
      .then(setCollection)
      .catch(() => setError(true));
  }, [slug]);

  if (error) return <Empty label="Collection not found." />;
  if (!collection) return <Loading />;

  const images = collection.images || [];
  const filtered =
    tab === "all"
      ? images
      : images.filter((img) => (tab === "photoshoot" ? img.is_photoshoot : !img.is_photoshoot));

  return (
    <>
      <section className="wrap detail-hero">
        <img src={collection.cover_image} alt={collection.title} />
        <div>
          <span className="eyebrow">{collection.genre}</span>
          <h1 style={{ fontSize: "clamp(34px,5vw,58px)" }}>{collection.title}</h1>
          <p className="detail-story">{collection.story}</p>
          <div className="detail-facts">
            <div className="detail-fact">
              Genre<b>{collection.genre}</b>
            </div>
            {collection.season_year && (
              <div className="detail-fact">
                Season<b>{collection.season_year}</b>
              </div>
            )}
            {collection.fabric_and_technique && (
              <div className="detail-fact">
                Materials<b>{collection.fabric_and_technique}</b>
              </div>
            )}
            <div className="detail-fact">
              Pieces<b>{collection.artistic_elements?.length || 0}</b>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap"><Stitch /></div>

      <section className="wrap" style={{ marginTop: 50 }}>
        <div className="section-head" style={{ marginTop: 0 }}>
          <div>
            <span className="eyebrow">Gallery</span>
            <h2>Look book &amp; photoshoot</h2>
          </div>
        </div>
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
          <Empty label="No photos in this category yet." />
        ) : (
          <div className="masonry">
            {filtered.map((img) => (
              <img key={img.id} src={img.image} alt={img.caption || collection.title} loading="lazy" />
            ))}
          </div>
        )}
      </section>

      <section className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Pieces</span>
            <h2>Artistic Elements</h2>
          </div>
          <p className="section-note">
            {collection.artistic_elements?.length || 0} pieces that make up this collection.
          </p>
        </div>
        {(!collection.artistic_elements || collection.artistic_elements.length === 0) ? (
          <Empty label="Add artistic elements to this collection from the admin panel." />
        ) : (
          <div className="elements-grid">
            {collection.artistic_elements.map((el) => (
              <Link
                to={`/elements/${el.id}`}
                className="element-card"
                key={el.id}
              >
                <div className="element-img">
                  {el.cover_image && <img src={el.cover_image} alt={el.title} loading="lazy" />}
                </div>
                <div className="element-title">{el.title}</div>
                <div style={{ fontSize: 12, color: "var(--grey)" }}>
                  {el.image_count} photo{el.image_count === 1 ? "" : "s"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
