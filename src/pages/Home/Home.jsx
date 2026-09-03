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
      <div id="explore-menu">
        <MenuPdf />
      </div>
    </div>
  );
};

export default Home;
