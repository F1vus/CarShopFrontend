import { Link } from "react-router-dom";
import "styles/_home-page.scss";

function HomePage() {
  return (
    <section className="home-page">
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
    </section>
  );
}

export default HomePage;
