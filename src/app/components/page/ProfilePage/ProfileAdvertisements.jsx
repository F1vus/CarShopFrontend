import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import profileService from "services/profile.service.js";
import "styles/profilePage/_profile-advertisements.scss";
import partners from "assets/img/auth-page/partners.svg";
import Loader from "../../UI/Loader";
import CarCard from "../../UI/CarCard";
import carService from "../../../services/car.service";

function ProfileAdvertisements({ profileId }) {
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [tab, setTab] = useState("active");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!profileId) return;
    setIsLoading(true);
    setIsError(false);

    profileService
      .getProfileCars(profileId)
      .then((data) => setCars(data || []))
      .catch((err) => {
        console.error("Fetch cars error:", err);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, [profileId]);

  // TODO: add useEffect for favorites

  const handleDelete = async (carId) => {
    // ask user to confirm
    console.log(carId);

    setIsLoading(true);
    try {
      await carService.deleteById(carId);

      setCars((prev) => prev.filter((c) => (c.id || c._id) !== carId));
      setFavorites((prev) => prev.filter((c) => (c.id || c._id) !== carId));
    } catch (err) {
      console.error("Delete car error:", err);
      alert("Wystąpił błąd podczas usuwania ogłoszenia. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  const handleEdit = (car) => {
    const carId = car.id || car._id;
    navigate(`/profile/advertisements/${carId}/edit`, { state: { car } });
  };

  if (isError) return <Navigate to="/*" replace />;

  const isActiveTab = tab === "active";

  return (
    <article className="profile-ads">
      {/* NAVIGATION */}
      <nav className="profile-ads__navigation" aria-label="Profile tabs">
        <li className="profile-ads__navigation-item">
          <button
            type="button"
            className={`profile-ads__tab-btn ${
              isActiveTab ? "link-active" : ""
            }`}
            onClick={() => setTab("active")}
            aria-pressed={isActiveTab}
          >
            Aktywne
          </button>
        </li>

        <li className="profile-ads__navigation-item">
          <button
            type="button"
            className={`profile-ads__tab-btn ${
              !isActiveTab ? "link-active" : ""
            }`}
            onClick={() => setTab("favorites")}
            aria-pressed={!isActiveTab}
          >
            Ulubione
          </button>
        </li>
      </nav>

      <div className="profile-ads__content">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* ---------- ACTIVE TAB ---------- */}
            {isActiveTab && (
              <>
                <h4 className="profile-ads__title">Aktywne</h4>

                <div className="profile-ads__content-block">
                  {cars.length > 0 && (
                    <div className="profile-ads__content-list">
                      <ul className="profile-ads__list">
                        {cars.map((car) => {
                          const id = car.id || car._id;
                          return (
                            <li
                              key={id}
                              className="profile-ads__list-item"
                              aria-label={`ogłoszenie-${id}`}
                            >
                              <CarCard carInfo={car} isProfileCard={true} handles={{handleDelete, handleEdit}}/>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <div className="profile-ads__add-block">
                    <img
                      className="profile-ads__add-img"
                      src={partners}
                      alt="Add new car"
                    />
                    <p className="profile-ads__add-text">
                      Dodaj już dziś ogłoszenie swojego kolejnego pojazdu.
                    </p>
                    <Link to="/sellcar" className="profile-ads__add-btn">
                      Wyceń swoje auto
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* ---------- FAVORITES TAB ---------- */}
            {!isActiveTab && (
              <>
                <h4 className="profile-ads__title">Ulubione</h4>

                <div className="profile-ads__content-block">
                  {favorites.length > 0 ? (
                    <div className="profile-ads__content-list">
                      <ul className="profile-ads__list">
                        {favorites.map((fav) => (
                          <li
                            key={fav.id || fav._id}
                            className="profile-ads__list-item"
                          >
                            <CarCard carInfo={fav} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="profile-ads__empty">
                      <img
                        className="profile-ads__add-img"
                        src={partners}
                        alt="Add new car"
                      />
                      <p>Brak ulubionych ogłoszeń.</p>
                      <Link to="/cars" className="profile-ads__browse-btn">
                        Przeglądaj pojazdy
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </article>
  );
}

export default ProfileAdvertisements;
