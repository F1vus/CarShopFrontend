import React, { useState, useEffect, useRef } from "react";
import "../../assets/styles/_navbar.scss";
import { Link } from "react-router-dom";
import siteLogo from "@/app/assets/img/logo-large.svg";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <div className="navbar__left">
          <button
            className={`navbar__hamburger ${menuOpen ? "is-open" : ""}`}
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((s) => !s)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="navbar__logo">
            <Link
              to="/home"
              className="navbar__link"
              aria-label="Strona główna"
            >
              <img src={siteLogo} alt="CarShop" />
            </Link>
          </div>
        </div>

        <nav
          className={`navbar__menu ${menuOpen ? "is-open" : ""}`}
          aria-label="Główne"
        >
          <div className="navbar__menu-logo" onClick={closeMenu}>
            <Link
              to="/home"
              className="navbar__link"
              aria-label="Strona główna"
            >
              <img src={siteLogo} alt="CarShop" />
            </Link>
          </div>

          <div className="navbar__item">
            <Link to="/sellcar" className="navbar__link" onClick={closeMenu}>
              Zacznij Sprzedawać
            </Link>
          </div>
          <div className="navbar__item">
            <Link to="/cars" className="navbar__link" onClick={closeMenu}>
              Samochody
            </Link>
          </div>
          <div className="navbar__item">
            <Link to="/contacts" className="navbar__link" onClick={closeMenu}>
              Kontakty
            </Link>
          </div>
        </nav>

        <div className="navbar__actions">
          <div className={`navbar__search ${searchOpen ? "is-open" : ""}`}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Szukaj"
              aria-label="Szukaj"
            />
            <button
              type="button"
              className="navbar__search-toggle"
              aria-label={
                searchOpen ? "Zamknij wyszukiwanie" : "Otwórz wyszukiwanie"
              }
              onClick={() => setSearchOpen((s) => !s)}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          <div className="navbar__icons">
            <div className="navbar__icons-item">
              <Link to="/basket" className="navbar__link">
                <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i>
                <span className="navbar__icons-text">Koszyk</span>
              </Link>
            </div>
            <div className="navbar__icons-item">
              <Link to="/auth/register" className="navbar__link">
                <i className="fa-regular fa-user" aria-hidden="true"></i>
                <span className="navbar__icons-text">Zrejestruj się</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`navbar__backdrop ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
    </header>
  );
}