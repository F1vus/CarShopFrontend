import { Link } from "react-router-dom";
import "styles/_home-page.scss";
import Slider from "../UI/Slider";
import logos from "../../assets/logos/logos";
import Divider from "../UI/Divider";
import womanImage from "assets/img/people/women.png";

function HomePage() {
  return (
    <div className="home-page">
      <header className="home-page__header wide-container">
        <div className="home-page__content">
          <h1 className="home-page__title">
            Twoje nowe auto czeka – sprawdź naszą ofertę już dziś!
          </h1>
          <p className="home-page__subtitle">
            Z nami oszczędzasz czas, pieniądze i stres.
          </p>
          <Link to="/cars" className="home-page__cta-button">
            Wyceń swoje auto
          </Link>
        </div>
      </header>
      <section className="wide-container">
        <Slider>
          {/* Double creating */}
          {[...logos, ...logos].map((logoUrl, index) => (
            <div className="slide" key={index}>
              <img src={logoUrl} alt={`logo-${index}`} />
            </div>
          ))}
        </Slider>
      </section>
      <Divider />
      <section className="out-benefits">
        <div className="out-benefits__info-block">
          <h3 className="out-benefits__title">
            Kupuj bez stresu – wybierz pewność i jakość
          </h3>
          <p className="out-benefits__info">
            Działamy na rynku od 10 lat. Każdy samochód sprawdzany jest przez
            doświadczonych mechaników, a klient otrzymuje pełną historię
            serwisową oraz gwarancję satysfakcji.
          </p>
          <Link to="/cars" className="out-benefits__cta-button">
            Wyszukaj Samochód
          </Link>
        </div>
        <div className="out-benefits__image-block">
          <img src={womanImage} alt="happy-person" />
        </div>
      </section>
    </div>
  );
}

export default HomePage;
