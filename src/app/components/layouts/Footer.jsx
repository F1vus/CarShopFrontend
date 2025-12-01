import React from "react";
import "../../assets/styles/_footer.scss";
import siteLogo from "assets/img/logo-large.svg";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <nav className="footer__nav">
          <div className="footer__column footer__column--social">
            <h4 className="footer__title">Znajdź nas</h4>

            <a href="#" className="footer__link">
              <i className="fa-brands fa-pinterest"></i> Pinterest
            </a>

            <a href="#" className="footer__link">
              <i className="fa-brands fa-instagram"></i> Instagram
            </a>

            <a href="#" className="footer__link">
              <i className="fa-brands fa-facebook"></i> Facebook
            </a>
          </div>

          <span className="footer__separator"></span>

          <div className="footer__column footer__column--menu">
            <div className="footer__logo">
              <Link to="/home">
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
              Polityka Prywatności
            </Link>
          </div>

          <span className="footer__separator"></span>

          <div className="footer__column footer__column--contact">
            <h4 className="footer__title">Dane kontaktowe</h4>
            <p className="footer__text">
              Telefon: +48 000 000 000, 48 111 111 111
            </p>
            <p className="footer__text">Email: carshop@carshop.pl</p>
            <p className="footer__text">Od pn do nd w godz. 08:00–20:20</p>
            <p className="footer__text">
              Chat: od pn do pt w godz. 09:00–24:00
            </p>
          </div>
        </nav>
      </div>

      <p className="footer__copyright">
        © {new Date().getFullYear()} CarShop — Wszystkie prawa zastrzeżone.
      </p>
    </footer>
  );
}
