import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";

const Navbar = () => {
  const scrollToTop = () => {
    scroll.scrollToTop({
      smooth: true,
      duration: 800
    });
  };

  return (
    <div className="navbar">
      <Link to="/" onClick={scrollToTop}>
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <li>
          <Link to="/" onClick={scrollToTop}>
            Home
          </Link>
        </li>
        <li>
          <ScrollLink
            to="explore-menu"
            spy={true}
            smooth={true}
            offset={-60} // Ajuste para la altura de la barra de navegación si es fija
            duration={800}
          >
            Menu
          </ScrollLink>
        </li>
        <li>
          <ScrollLink
            to="footer"
            spy={true}
            smooth={true}
            offset={-60} // Ajuste para la altura de la barra de navegación si es fija
            duration={800}
          >
            Contact us
          </ScrollLink>
        </li>
      </ul>
      <div className="navbar-right">
        <Link to="/search">
          <CiSearch />
        </Link>
      </div>
    </div>
  );
};
export default Navbar;
