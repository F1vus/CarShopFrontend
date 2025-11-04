import calendar from "assets/img/icons/calendar.svg";
import canister from "assets/img/icons/canister.svg";
import gearbox from "assets/img/icons/gearbox.svg";
import wheel from "assets/img/icons/wheel.svg";
import { useState } from "react";
import "styles/_car-card.scss";

function CarCard({ carInfo }) {
  const [isLiked, setIsLiked] = useState(false);

  const {
    name,
    price,
    description,
    mileage,
    petrolType,
    year,
    imageUrl,
    producent,
  } = carInfo;

  return (
    <div className="car-card">
      <div className="car-card__image">
        <img src={imageUrl} alt={name} />
      </div>

      <div className="car-card__info">
        <div>
          <h3 className="car-card__info-title">{name}</h3>
          <div className="car-card__info-description">{description}</div>
          <ul className="car-card__details">
            <li>
              <img src={wheel} alt="mileage" />
              <strong>Przebieg:</strong> {mileage} km
            </li>
            <li>
              <img src={calendar} alt="year" />
              <strong>Rok:</strong> {year}
            </li>
            <>
              {petrolType != null ? (
                <li>
                  <img src={canister} alt="canister" />
                  <strong>Paliwo:</strong> {petrolType.name}
                </li>
              ) : (
                <></>
              )}
            </>
          </ul>
        </div>
        {/* <div className="car-card__footer">
          
        </div> */}
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
