import React from "react";
import "../../assets/styles/_navbar.scss";

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="container navbar__container">
        <div className="navbar__logo">
          <img src="../../../../public/site-logo.svg" alt="CarShop" />
        </div>

        {/* //TODO Add routing to links */}
        <nav className="navbar__menu">
          <div className="navbar__item">
            <a href="#">Kup</a>
            <div className="navbar__dropdown">
              <a href="#">Nowe</a>
              <a href="#">Używane</a>
              <a href="#">Uszkodzone</a>
            </div>
          </div>

          <div className="navbar__item">
            <a href="#">Sprzedaj</a>
            <div className="navbar__dropdown">
              <a href="#">Nowe</a>
              <a href="#">Używane</a>
              <a href="#">Uszkodzone</a>
            </div>
          </div>

          <a href="#">Kontakty</a>
        </nav>

        <div className="navbar__search">
          <input type="text" placeholder="Szukaj" />
          <button>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <div className="navbar__icons">
          <div className="navbar__icons-item">
            <a href="#">
              <i className="fa-solid fa-cart-shopping"></i>Koszyk
            </a>
          </div>
          <div className="navbar__icons-item">
            <a href="#">
              <i className="fa-regular fa-user"></i> Zaloguj się
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
