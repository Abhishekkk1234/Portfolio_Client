// import React from "react";

// export default function Footer({ designer }) {
//   const year = new Date().getFullYear();
//   return (
//     <footer className="footer">
//       <div className="wrap">
//         <span>
//           © {year} {designer?.name || "Studio"}. {designer?.location}
//         </span>
//         <div className="footer-links">
//           {designer?.instagram_url && (
//             <a href={designer.instagram_url} target="_blank" rel="noreferrer">
//               Instagram
//             </a>
//           )}
//           {designer?.pinterest_url && (
//             <a href={designer.pinterest_url} target="_blank" rel="noreferrer">
//               Pinterest
//             </a>
//           )}
//           {designer?.email && <a href={`mailto:${designer.email}`}>{designer.email}</a>}
//         </div>
//       </div>
//     </footer>
//   );
// }
import React from "react";

export default function Footer({ designer }) {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <span>
          © {year} {designer?.name || "Studio"}. {designer?.location}
        </span>
        <div className="footer-links">
          {designer?.instagram_url && (
            <a href={designer.instagram_url} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          {designer?.linkedin_url && (
            <a href={designer.linkedin_url} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {designer?.pinterest_url && (
            <a href={designer.pinterest_url} target="_blank" rel="noreferrer">
              Pinterest
            </a>
          )}
          {designer?.email && <a href={`mailto:${designer.email}`}>{designer.email}</a>}
        </div>
      </div>
    </footer>
  );
}
