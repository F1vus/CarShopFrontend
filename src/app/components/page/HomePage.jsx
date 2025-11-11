import { Link } from "react-router-dom";
import "styles/_home-page.scss";
import Slider from "../UI/Slider";
import logos from "../../assets/logos/logos";
import Divider from "../UI/Divider";

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
      <section className="out-benefits">

      </section>
    </div>
  );
}

export default HomePage;
