import "../../assets/styles/_navbar.scss";
import { Link } from "react-router-dom";
import siteLogo from "@/app/assets/img/logo-large.svg";

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="container navbar__container">
        <div className="navbar__logo">
          <Link to="/home" className="navbar__link">
            <img src={siteLogo} alt="CarShop" />
          </Link>
        </div>

        <nav className="navbar__menu">
          <div className="navbar__item">
            <Link to="/sellcar" className="navbar__link">
              Zacznij Sprzedawać
            </Link>
          </div>
          <div className="navbar__item">
            <Link to="/cars" className="navbar__link">
              Samochody
            </Link>
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
            <Link to="/auth/register" className="navbar__link">
              <i className="fa-regular fa-user"></i>
              <span>Zrejestruj się</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
