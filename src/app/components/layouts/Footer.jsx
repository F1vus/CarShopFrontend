import React from "react";
import "../../assets/styles/_footer.scss";

export default function Footer() {
  return (
    <footer className="site-footer">
  <div className="footer-inner container">
    <nav className="footer-nav">
      <div className="footer-column">
        <h4>Znajdź nas</h4>
        <a href="#"><i className="fa-brands fa-pinterest"></i> Pinterest</a>
        <a href="#"><i className="fa-brands fa-instagram"></i> Instagram</a>
        <a href="#"><i className="fa-brands fa-facebook"></i> Facebook</a>
      </div>

      <span className="footer-separator"></span>

      <div className="footer-column">
        <h4>Info</h4>
        <a href="#">Pomoc</a>
        <a href="#">Kontakt</a>
        <a href="#">Reklama</a>
        <a href="#">Polityka Prywatnosci</a>
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
  <p className="footer-text">© {new Date().getFullYear()} CarShop — Wszystkie prawa zastrzeżone.</p>
</footer>

  );
}