import React from "react";
import "./Home.css";

import Header from "../../components/Header/Header";
import cloverLogo from "../../assets/clover-logo.png";
import grubhubLogo from "../../assets/grubhub-logo.png";

const Home = () => {
  return (
    <main className="home-page">

      {/* HERO / BANNER */}
      <Header />

      {/* ORDER ONLINE */}
      <section className="order-platforms">
        <h2>Order Online</h2>

        <p>
          Choose your preferred ordering platform.
        </p>

        <div className="order-buttons">

          {/* CLOVER */}
          <a
            href="https://beyondnaturalandco.cloveronline.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="order-button clover-button"
            aria-label="Order Beyond Natural & Co on Clover"
          >
            <img
              src={cloverLogo}
              alt="Order on Clover"
            />
          </a>

          {/* GRUBHUB */}
          <a
            href="https://www.grubhub.com/restaurant/15232928"
            target="_blank"
            rel="noopener noreferrer"
            className="order-button grubhub-button"
            aria-label="Order Beyond Natural & Co on Grubhub"
          >
            <img
              src={grubhubLogo}
              alt="Order on Grubhub"
            />
          </a>

        </div>
      </section>

    </main>
  );
};

export default Home;
