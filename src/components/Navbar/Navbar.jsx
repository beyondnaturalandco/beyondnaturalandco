import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { CiSearch } from "react-icons/ci";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  /* scroll to top function */
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  const { getTotalCartAmount } = useContext(StoreContext);

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          <a href="#">Home</a>
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact us
        </a>
      </ul>
      <div className="navbar-right">
        <Link to="/search" onClick={() => setMenu("search")}
          className={menu === "search" ? "active" : ""}>
          <CiSearch />
        </Link>
        {/* <div className="navbar-search-icon">
          <Link to="/cart" onClick={() => setMenu("cart")}
          className={menu === "cart" ? "active" : ""}>
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
