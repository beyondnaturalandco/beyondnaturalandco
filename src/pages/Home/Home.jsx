import React from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import AboutMe from "../../components/AboutMe/AboutMe";
import MenuPdf from "../../components/menuPdf/MenuPdf";

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
            Order with Clover
          </a>

          <a
            href="https://www.grubhub.com/restaurant/15232928"
            target="_blank"
            rel="noopener noreferrer"
            className="order-button grubhub-button"
          >
            Order with Grubhub
          </a>
        </div>
      </section>

      <div id="explore-menu">
        <MenuPdf />
      </div>
    </div>
  );
};

export default Home;
import { FaClover } from "react-icons/fa6";
import { SiGrubhub } from "react-icons/si";
<div className="order-buttons">
  <a
    href="https://beyondnaturalandco.cloveronline.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="order-button clover-button"
  >
    <FaClover className="order-icon" />
    Order with Clover
  </a>

  <a
    href="https://www.grubhub.com/restaurant/15232928"
    target="_blank"
    rel="noopener noreferrer"
    className="order-button grubhub-button"
  >
    <SiGrubhub className="order-icon" />
    Order with Grubhub
  </a>
</div>
