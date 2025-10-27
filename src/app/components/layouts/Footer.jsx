import React from "react";
import "../../assets/styles/_footer.scss";
import siteLogo from "assets/img/logo-large.svg";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        <nav className="footer-nav">
          <div className="footer-column">
            <h4>Znajdź nas</h4>
            <a href="#">
              <i className="fa-brands fa-pinterest"></i> Pinterest
            </a>
            <a href="#">
              <i className="fa-brands fa-instagram"></i> Instagram
            </a>
            <a href="#">
              <i className="fa-brands fa-facebook"></i> Facebook
            </a>
          </div>

          <span className="footer-separator"></span>

          <div className="footer-column">
            <div className="footer-column__logo">
              <Link to="/home" className="footer__link">
                <img src={siteLogo} alt="CarShop" />
              </Link>
            </div>
            <Link to="/" className="footer__link">
              Pomoc
            </Link>
            <Link to="/contacts" className="footer__link">
              Kontakty
            </Link>
            <Link to="/" className="footer__link">
              Reklama
            </Link>
            <Link to="/" className="footer__link">
              Polityka Prywatnosci
            </Link>
          </div>

          <span className="footer-separator"></span>

          <div className="footer-column">
            <h4>Dane kontaktowe</h4>
            <p>Telefon: +48 000 000 000, 48 111 111 111</p>
            <p>Email: carshop@carshop.pl</p>
            <p>Od pn do nd w godz. 08:00–20:20</p>
            <p>Chat: od pn do pt w godz. 09:00–24:00</p>
          </div>
        </nav>
      </div>
      <p className="footer-text">
        © {new Date().getFullYear()} CarShop — Wszystkie prawa zastrzeżone.
      </p>
    </footer>
  );
}
