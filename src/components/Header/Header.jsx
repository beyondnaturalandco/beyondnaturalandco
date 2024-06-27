import React, { useEffect, useState } from 'react'
import './Header.css'
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";

const Header = () => {
  const [bgImageLoaded, setBgImageLoaded] = useState(false);

  useEffect(() => {
    const bgImage = new Image();
    bgImage.src = "https://raw.githubusercontent.com/beyondnaturalandco/beyondnaturalandco/main/public/header_img.webp";
    bgImage.onload = () => {
      setBgImageLoaded(true);
    };
  }, []);
  return (
    <div className={`header ${bgImageLoaded ? 'loaded' : ''}`}>
      <div className="header-contents">
        {/* <h2>Order your favourite food here</h2>
        <p>"Indulge Your Palate: Welcome to Our Culinary Haven!" "Discover Delectable Delights: Your Dining Adventure Begins Here!"</p> */}
        <ScrollLink to="explore-menu"
            spy={true}
            smooth={true}
            offset={-60} // Ajuste para la altura de la barra de navegación si es fija
            duration={800}>View Menu</ScrollLink>
      </div>
    </div>
  )
}

export default Header
