import { useEffect, useState } from "react";
import carService from "../../services/car.service";
import battery from "assets/img/icons/large/battery-lg-white.svg";
import speedometer from "assets/img/icons/large/speedometer-lg-white.svg";
import canister from "assets/img/icons/large/canister-lg-white.svg";
import wheel from "assets/img/icons/large/wheel-lg-white.svg";
import engine from "assets/img/icons/large/engine-lg-white.svg";
import "styles/_car-info-page.scss";
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

  if (error) return <p>{error}</p>;

  return (
    <>
      {isLoaded && (
        <section className="car-info">
          <div className="car-info__main">
            <div className="car-info__image">
              <img src={carInfo.photos[0].url} alt={carInfo.name} />
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
                        {carInfo.petrolType.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <img src={canister} alt="Rodzaj paliwa" />
                      <span className="span-title">Rodzaj paliwa</span>
                      <span className="span-info">
                        {carInfo.petrolType.name}
                      </span>
                    </>
                  )}
                </li>
                {!isElectric && (
                  <li className="car-info__important-data-element">
                    <img src={engine} alt="Pojemność skokowa" />
                    <span className="span-title">Pojemność skokowa</span>
                    <span className="span-info">{carInfo.engineCapacity}</span>
                  </li>
                )}
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
                  {{
                    POOR: "Straszny",
                    USED: "Używany",
                    NEW: "Nowy",
                  }[carInfo.carState] ?? ""}
                </span>{" "}
                - <span>{carInfo.year} rok</span>
              </p>
              <p>
                <span>Cena: </span>
                <span className="car-info__aside-details-text">
                  {carInfo.price}
                </span>
                <span> PLN</span>
              </p>
            </div>
            <div className="car-info__aside-salesman-info">
              <h4>{carInfo.owner?.name || "Sprzedawca"}</h4>
              <p className="user-info">
                <i className="bi bi-shield-fill-check"></i>
                <span>{carInfo.owner?.type || "Przywatny sprzedawca"}</span>
              </p>
              <p>
                <i className="bi bi-person-fill"></i>
                <span>{carInfo.owner?.type || "Sprzedający od 2020"}</span>
              </p>
              <div className="buttons-block">
                <button className="write-to-button">Napisz</button>

                {showPhone ? (
                  <div className="car-info__phone-block">
                    <p className="phone-number">
                      {carInfo.owner?.phoneNumber || "Brak numeru"}
                    </p>
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
