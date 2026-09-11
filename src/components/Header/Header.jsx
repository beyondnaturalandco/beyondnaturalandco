import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-overlay"></div>

      <div className="header-contents">
        <h1>Fresh • Healthy • Natural</h1>

        <p>
          Fresh, balanced meals made with quality ingredients.
          Eat better. Feel better. Go Beyond.
        </p>

        <a
          href="https://beyondnaturalandco.cloveronline.com/"
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
