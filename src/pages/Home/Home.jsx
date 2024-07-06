import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AboutMe from "../../components/AboutMe/AboutMe";
import MenuPdf from "../../components/menuPdf/MenuPdf";
const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div>
      <Header />
      <AboutMe />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <MenuPdf />
    </div>
  );
};

export default Home;
