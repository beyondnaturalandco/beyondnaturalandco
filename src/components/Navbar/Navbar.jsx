import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import menuPdf from "../../assets/Pdf/Menu beyon.pdf";

const Navbar = () => {
  const scrollToTop = () => {
    scroll.scrollToTop({
      smooth: true,
      duration: 800,
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
            HOME
          </Link>
        </li>

        <li>
          <a
            href={menuPdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            MENU
          </a>
        </li>

        <li>
          <Link to="/about">ABOUT</Link>
        </li>

        <li>
          <Link to="/catering">CATERING</Link>
        </li>
      </ul>

      <div className="navbar-right">
        <a
          href="https://www.grubhub.com/restaurant/15232928"
          target="_blank"
          rel="noopener noreferrer"
          className="order-now-button"
        >
          ORDER NOW
        </a>
      </div>
    </div>
  );
};

export default Navbar;
