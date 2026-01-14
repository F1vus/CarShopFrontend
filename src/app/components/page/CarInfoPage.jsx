import { useEffect, useState } from "react";
import carService from "../../services/car.service";
import battery from "assets/img/icons/large/battery-lg-white.svg";
import speedometer from "assets/img/icons/large/speedometer-lg-white.svg";
import canister from "assets/img/icons/large/canister-lg-white.svg";
import wheel from "assets/img/icons/large/wheel-lg-white.svg";
import engine from "assets/img/icons/large/engine-lg-white.svg";
import "styles/_car-info-page.scss";
import Carousel from "../UI/Carousel";
import { useLocation } from "react-router-dom";

function CarInfoPage({ carId }) {
  const [carInfo, setCarInfo] = useState({});
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isElectric, setIsElectric] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const location = useLocation();

  useEffect(() => {
    carService
      .getById(carId)
      .then((data) => {
        setCarInfo(data || {});
        console.log(data);
        
        setIsElectric(data?.petrolType?.name === "Electric");
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Nie udało się załadować samochodów.");
      });
  }, [carId, location.pathname]);

  const handleShowPhoneNumber = () => {
    setShowPhone((prev) => !prev);
  };

  const formatExactDate = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "";
      }

      return new Intl.DateTimeFormat("pl-PL", {
        year: "numeric",
      }).format(date);
    } catch (err) {
      return "";
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";

    const cleaned = phone.replace(/[^\d+]/g, "");

    if (!cleaned.startsWith("+")) return phone;

    const match = cleaned.match(/^(\+\d{1,3})(\d+)$/);
    if (!match) return phone;

    const country = match[1];
    const rest = match[2];

    // group remaining digits in blocks of 3
    const grouped = rest.match(/.{1,3}/g)?.join(" ");

    return `${country} ${grouped}`;
  };

  if (error) return <p>{error}</p>;

  return (
    <>
      {isLoaded && (
        <section className="car-info">
          <div className="car-info__main">
            <div className="car-info__image">
              <Carousel
                photos={carInfo.photos || []}
                altPrefix={carInfo.name}
              />
            </div>
            <span className="divider-span"></span>
            <div className="car-info__important-data">
              <ul className="car-info__important-data-list">
                <li className="car-info__important-data-element">
                  <img src={wheel} alt="Przebieg" />
                  <span className="span-title">Przebieg</span>
                  <span className="span-info">{carInfo.mileage} km</span>
                </li>
                <li className="car-info__important-data-element">
                  {isElectric ? (
                    <>
                      <img src={battery} alt="Rodzaj paliwa" />
                      <span className="span-title">Rodzaj paliwa</span>
                      <span className="span-info">
                        {carInfo.petrolType?.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <img src={canister} alt="Rodzaj paliwa" />
                      <span className="span-title">Rodzaj paliwa</span>
                      <span className="span-info">
                        {carInfo.petrolType?.name}
                      </span>
                    </>
                  )}
                </li>
                {!isElectric && (
                  <li className="car-info__important-data-element">
                    <img src={engine} alt="Pojemność skokowa" />
                    <span className="span-title">Pojemność skokowa</span>
                    <span className="span-info">
                      {carInfo.engineCapacity} cc
                    </span>
                  </li>
                )}
                <li className="car-info__important-data-element">
                  <span
                    className="color-swatch"
                    style={{ background: carInfo.color?.name || "#999" }}
                  ></span>
                  <span className="span-title">Kolor</span>
                  <span className="span-info">{carInfo.color?.name}</span>
                </li>
                <li className="car-info__important-data-element">
                  <img src={speedometer} alt="Moc" />
                  <span className="span-title">Moc</span>
                  <span className="span-info">{carInfo.power}</span>
                </li>
              </ul>
            </div>
            <span className="divider-span"></span>
            <div className="car-info__description">
              <h3 className="car-info__description-title">Opis</h3>
              <p className="car-info__description-text">
                {carInfo.description}
              </p>
            </div>
          </div>
          <aside className="car-info__aside">
            <h2 className="car-info__aside-title">{carInfo.name}</h2>
            <div className="car-info__aside-details">
              <p>
                <span>
                  {{ POOR: "Uszkodzony", USED: "Używany", NEW: "Nowy" }[
                    carInfo.carState
                  ] ?? ""}
                </span>
                - <span>{carInfo.year} rok</span>
              </p>
              <p>
                <span>Cena: </span>
                <span className="car-info__aside-details-text">
                  {Number(carInfo.price || 0).toLocaleString("pl-PL")}
                </span>
                <span> PLN</span>
              </p>
              {carInfo.producent?.name && (
                <p>
                  <span>Producent: </span>
                  <strong>{carInfo.producent.name}</strong>
                </p>
              )}
              {typeof carInfo.hadAccidents === "boolean" && (
                <p>
                  <span>Historia: </span>
                  <strong
                    className={
                      carInfo.hadAccidents
                        ? "badge badge-danger"
                        : "badge badge-ok"
                    }
                  >
                    {carInfo.hadAccidents ? "Miał kolizje" : "Bez kolizji"}
                  </strong>
                </p>
              )}
            </div>
            <div className="car-info__aside-salesman-info">
              <div className="salesman-top">
                <div className="salesman-meta">
                  <h4>{carInfo.owner?.name || "Sprzedawca"}</h4>
                  <p className="user-info">
                    <i className="bi bi-shield-fill-check"></i>
                    <span>{carInfo.owner?.type || "Prywatny sprzedawca"}</span>
                  </p>
                  <p>
                    <i className="bi bi-person-fill"></i>
                    <span>
                      {carInfo.owner?.registrationDate ? (
                        <>
                          Sprzedający od{" "}
                          <strong className="registration-date-bold">
                            {formatExactDate(carInfo.owner.registrationDate)}
                          </strong>
                        </>
                      ) : (
                        "Data niedostępna"
                      )}
                    </span>
                  </p>
                </div>
              </div>
              <div className="buttons-block">
                <button className="write-to-button">Napisz</button>

                {showPhone ? (
                  <div className="car-info__phone-block">
                    {carInfo.owner?.phoneNumber ? (
                      <a
                        href={`tel:${carInfo.owner.phoneNumber}`}
                        className="phone-number phone-number--clickable"
                      >
                        <i
                          className="bi bi-telephone-fill"
                          style={{ marginRight: 6 }}
                        ></i>
                        {formatPhoneNumber(carInfo.owner.phoneNumber)}
                      </a>
                    ) : (
                      <p className="phone-number">Brak numeru</p>
                    )}
                  </div>
                ) : (
                  <button
                    className="show-phone-button"
                    onClick={handleShowPhoneNumber}
                  >
                    Wyświetl numer
                  </button>
                )}
              </div>
            </div>
          </aside>
        </section>
      )}
    </>
  );
}

export default CarInfoPage;
