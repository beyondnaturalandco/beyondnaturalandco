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
            to="about_me"
            spy={true}
            smooth={true}
            offset={-60} // Ajuste para la altura de la barra de navegación si es fija
            duration={800}
          >
            About
          </ScrollLink>
        </li>
      </ul>
      <div className="navbar-right">
        <div className="navbar-right">
  <a
    href="https://www.grubhub.com/restaurant/15232928"
    target="_blank"
    rel="noopener noreferrer"
    className="order-now-button"
  >
    ORDER NOW
  </a>

  <Link to="/search">
    <CiSearch />
  </Link>
</div>
        <Link to="/search">
          <CiSearch />
        </Link>
      </div>
    </div>
  );
};
export default Navbar;
.order-now-button {
  padding: 12px 24px;
  background-color: #949b4b;
  color: white !important;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: 0.3s;
}

.order-now-button:hover {
  background-color: #68702f;
  transform: translateY(-2px);
}

@media (max-width: 750px) {
  .order-now-button {
    padding: 9px 15px;
    font-size: 12px;
  }
}
