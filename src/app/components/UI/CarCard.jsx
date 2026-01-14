import calendar from "assets/img/icons/calendar.svg";
import canister from "assets/img/icons/canister.svg";
import battery from "assets/img/icons/battery.svg";
import wheel from "assets/img/icons/wheel.svg";
import "styles/_car-card.scss";
import { Link, useLocation } from "react-router-dom";
import LikeButton from "./LikeButton";
import localStorageService from "../../services/localStorage.service";
import config from "../../../config";
import { useEffect, useRef, useState } from "react";

function CarCard({
  carInfo,
  isProfileCard = false,
  handles = {},
  isLiked = false,
  onRemoveFavorite,
}) {
  const currentPath = useLocation().pathname;
  const { handleDelete, handleEdit } = handles;
  const favorites = localStorageService.getFavoritesAds() || [];

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

  const imageContainerRef = useRef(null);
  const [photoSrc, setPhotoSrc] = useState(null);

  useEffect(() => {
    if (!photos || !photos[0]) return;
    const base = config.photosEndpoint + photos[0].url;

    const sizes = [64, 128, 256, 512]; // available sizes

    function chooseSize(containerPx) {
      const dpr = window.devicePixelRatio || 1;
      const needed = Math.ceil(containerPx * dpr);

      return sizes.find((s) => s >= needed) || sizes[sizes.length - 1];
    }

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width || 200;
        const chosen = chooseSize(width);
        setPhotoSrc(`${base}${chosen}`);
      }
    });

    if (imageContainerRef.current) ro.observe(imageContainerRef.current);

    if (imageContainerRef.current) {
      const w = imageContainerRef.current.getBoundingClientRect().width;
      const chosen = chooseSize(w);
      setPhotoSrc(`${base}${chosen}`);
    }

    return () => ro.disconnect();
  }, [photos]);

  return (
    <div className={`car-card ${isProfileCard ? "car-card-profile" : ""}`}>
      <div className="car-card__container">
        <div className="car-card__image" ref={imageContainerRef}>
          {photoSrc ? (
            <img src={photoSrc} alt={name} />
          ) : (
            <div className="placeholder" />
          )}
        </div>

        <div className="car-card__info">
          <div className="car-card__info-block">
            <h3 className="car-card__info-title">
              {!isProfileCard ? (
                <Link to={currentPath + `/${id}`}>{name}</Link>
              ) : (
                name
              )}
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
            <p className="car-card__producer">Producent: {producent.name}</p>
          </div>
        </div>
        <div className="car-card__price">
          {price} <span>PLN</span>
        </div>
        {!isProfileCard && (
          <LikeButton
            carId={id}
            isLikedActive={favorites.includes(id)}
            onLikeChanged={(carId, isLiked) => {
              if (!isLiked && onRemoveFavorite) {
                onRemoveFavorite(carId);
              }
            }}
          />
        )}
      </div>

      {isProfileCard && (
        <>
          <hr className="card-divider" />
          <div className="control-block">
            <div className="id-section">
              <strong>Id: {id}</strong>
            </div>
            <div className="profile-ads__card-actions">
              <button
                type="button"
                className="profile-ads__btn profile-ads__btn--edit"
                onClick={() => handleEdit(carInfo)}
                aria-label={`Edytuj ogłoszenie ${id}`}
              >
                Edytuj
              </button>

              <button
                type="button"
                className="profile-ads__btn profile-ads__btn--delete"
                onClick={() => handleDelete(id)}
              >
                Usuń
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CarCard;
