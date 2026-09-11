import React from "react";
import "./Header.css";

const Header = () => {

  const bannerImage = `${import.meta.env.BASE_URL}header_img.webp`;

  return (
    <header
      className="header"
      style={{
        backgroundImage: `url("${bannerImage}")`,
      }}
    >

      <div className="header-overlay"></div>

      <div className="header-contents">

        <h1>
          Fresh • Healthy • Natural
        </h1>

        <p>
          Fresh, balanced meals made with quality ingredients.
          Eat better. Feel better. Go Beyond.
        </p>

        <a
          href="https://www.grubhub.com/restaurant/15232928"
          target="_blank"
          rel="noopener noreferrer"
          className="header-button"
        >
          ORDER NOW
        </a>

      </div>

    </header>
  );
};

export default Header;
