import React, { useEffect, useState } from "react";
import "./Header.css";
import menuPdf from "../../assets/Pdf/Menu beyon.pdf";

const Header = () => {
  const [bgImageLoaded, setBgImageLoaded] = useState(false);

  useEffect(() => {
    const bgImage = new Image();
    bgImage.src =
      "https://raw.githubusercontent.com/beyondnaturalandco/beyondnaturalandco/main/public/header_img.webp";

    bgImage.onload = () => setBgImageLoaded(true);
  }, []);

  return (
    <div className={`header ${bgImageLoaded ? "loaded" : ""}`}>
      <div className="header-contents">
        <a
          href={menuPdf}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Menu
        </a>
      </div>
    </div>
  );
};

export default Header;
