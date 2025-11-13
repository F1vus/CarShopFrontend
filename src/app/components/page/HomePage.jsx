import { Link } from "react-router-dom";
import "styles/_home-page.scss";
import Slider from "../UI/Slider";
import logos from "../../assets/logos/logos";
import Divider from "../UI/Divider";
import womenImage from "assets/img/people/women.png";
import peopleChoosingCar from "assets/img/people/people-choosing-car.png";
import FiltrationForm from "../UI/FiltrationForm";

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
      <Divider right={true} />
      <section className="search-car">
        <h3 className="search-car__title section-title">
          Sekcja wyszukiwania samochodu
        </h3>
        <p className="search-car__subtitle section-subtitle">
          Użyj filtrów, aby szybko znaleźć samochód dopasowany do Twoich
          potrzeb.
        </p>
        <div className="search-car__content">
          <div className="search-car__image-block">
            <img src={peopleChoosingCar} alt="choose car" />
          </div>
          <div className="search-car__form">
            <FiltrationForm variant="tablet" />
          </div>
        </div>
      </section>
      <Divider />
      {/* <div className="new-suggestions"> */}
        {/* <h3 className="new-suggestions__title section-title">
          Najpopularniejsze oferty w tym tygodniu
        </h3>
        <p className="new-suggestions__subtitle section-subtitle">
          Zobacz samochody, które nasi klienci wybierają najczęściej –
          sprawdzone, gotowe do odbioru, z pełną dokumentacją.
        </p>
        <div className="slider"></div>
      </div>
      <Divider right={true} /> */}
      <section className="out-benefits">
        <div className="out-benefits__info-block">
          <h3 className="out-benefits__title section-title">
            Kupuj bez stresu – wybierz pewność i jakość
          </h3>
          <p className="out-benefits__subtitle section-subtitle">
            Działamy na rynku od 10 lat. Każdy samochód sprawdzany jest przez
            doświadczonych mechaników, a klient otrzymuje pełną historię
            serwisową oraz gwarancję satysfakcji.
          </p>
          <Link to="/cars" className="out-benefits__cta-button">
            Wyszukaj Samochód
          </Link>
        </div>
        <div className="out-benefits__image-block">
          <img src={womenImage} alt="happy-person" />
        </div>
      </section>
    </div>
  );
}

export default HomePage;
