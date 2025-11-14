import calendar from "assets/img/icons/calendar.svg";
import canister from "assets/img/icons/canister.svg";
import battery from "assets/img/icons/battery.svg";
import wheel from "assets/img/icons/wheel.svg";
import { useState } from "react";
import "styles/_car-card.scss";
import { Link, useLocation } from "react-router-dom";

function CarCard({ carInfo }) {
  const [isLiked, setIsLiked] = useState(false);
  const currentPath = useLocation().pathname

  const {
    id,
    name,
    price,
    description,
    mileage,
    petrolType,
    year,
    photos,
    producent,
  } = carInfo;

  return (
    <div className="car-card">
      <div className="car-card__image">
        <img src={photos[0].url} alt={name} />
      </div>

      <div className="car-card__info">
        <div className="car-card__info-block">
          <h3 className="car-card__info-title">
            <Link to={currentPath + `/${id}`}>
              {name}
            </Link>
          </h3>
          <div className="car-card__info-description">{description}</div>
        </div>
        <div className="car-card__footer">
          <ul className="car-card__details">
            <li>
              <img src={wheel} alt="mileage" />
              <strong>Przebieg:</strong> {mileage} km
            </li>
            <li>
              <img src={calendar} alt="year" />
              <strong>Rok:</strong> {year}
            </li>
            <li>
              {petrolType.name === "Electric" ? (
                <>
                  <img src={battery} alt="battery" />
                  {petrolType.name}
                </>
              ) : (
                <>
                  <img src={canister} alt="canister" />
                  <strong>Paliwo:</strong> {petrolType.name}
                </>
              )}
            </li>
          </ul>
          <p>Producent: {producent.name}</p>
        </div>
      </div>
      <div className="car-card__price">
        {price} <span>PLN</span>
      </div>

      <div
        className="car-card__fav"
        onClick={() => setIsLiked((prev) => !prev)}
      >
        <i className={`bi bi-heart${!isLiked ? "" : "-fill"}`}></i>
      </div>
    </div>
  );
}

export default CarCard;
