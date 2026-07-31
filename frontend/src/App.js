import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import ElementDetail from "./pages/ElementDetail";
import Enquiry from "./pages/Enquiry";
import { getDesigner } from "./api/client";

export default function App() {
  const [designer, setDesigner] = useState(null);

  useEffect(() => {
    getDesigner()
      .then(setDesigner)
      .catch(() => setDesigner(null));
  }, []);

  return (
    <>
      <Navbar studioName={designer?.name} />
      <main>
        <Routes>
          <Route path="/" element={<Home designer={designer} />} />
          <Route path="/about" element={<About designer={designer} />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/elements/:id" element={<ElementDetail />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer designer={designer} />
    </>
  );
}

function NotFound() {
  return (
    <div className="wrap" style={{ padding: "140px 0", textAlign: "center" }}>
      <h1 style={{ fontSize: 40 }}>Page not found</h1>
      <p style={{ color: "var(--grey)", marginTop: 12 }}>
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
}
