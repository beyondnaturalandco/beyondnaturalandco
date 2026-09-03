import React from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import AboutMe from "../../components/AboutMe/AboutMe";
import cloverLogo from "../../assets/clover-logo.png";
import grubhubLogo from "../../assets/grubhub-logo.png";

const Home = () => {
  return (
    <div>
      <Header />
      <AboutMe />

      <section className="order-platforms">
        <h2>Order Online</h2>
        <p>Choose your preferred ordering platform.</p>

        <div className="order-buttons">
          <a
            href="https://beyondnaturalandco.cloveronline.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="order-button clover-button"
          >
            <img src={cloverLogo} alt="Clover" />
          </a>

          <a
            href="https://www.grubhub.com/restaurant/15232928"
            target="_blank"
            rel="noopener noreferrer"
            className="order-button grubhub-button"
          >
            <img src={grubhubLogo} alt="Grubhub" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
