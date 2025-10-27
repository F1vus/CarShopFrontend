import "../../assets/styles/_navbar.scss";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="container navbar__container">
        <div className="navbar__logo">
          <Link to="/home" className="navbar__link">
            <img src="/site-logo.svg" alt="CarShop" />
          </Link>
        </div>

        <nav className="navbar__menu">
          <div className="navbar__item">
            <Link to="/" className="navbar__link">
              Kup
            </Link>
            <div className="navbar__dropdown">
              <a href="#">Nowe</a>
              <a href="#">Używane</a>
              <a href="#">Uszkodzone</a>
            </div>
          </div>

          <div className="navbar__item">
            <Link to="/" className="navbar__link">
              Sprzedaj
            </Link>
            <div className="navbar__dropdown">
              <a href="#">Nowe</a>
              <a href="#">Używane</a>
              <a href="#">Uszkodzone</a>
            </div>
          </div>
          <div className="navbar__item">
            <Link to="/contacts" className="navbar__link">
              <span>Kontakty</span>
            </Link>
          </div>
        </nav>

        <div className="navbar__search">
          <input type="text" placeholder="Szukaj" />
          <button>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <div className="navbar__icons">
          <div className="navbar__icons-item">
            <Link to="/basket" className="navbar__link">
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Koszyk</span>
            </Link>
          </div>
          <div className="navbar__icons-item">
            <Link to="/auth" className="navbar__link">
              <i className="fa-regular fa-user"></i>
              <span>Zrejestruj się</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
