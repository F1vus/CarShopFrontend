import { useCallback, useEffect, useState } from "react";
import { Navigate, Link, useNavigate, useSearchParams } from "react-router-dom";
import profileService from "services/profile.service.js";
import "styles/profilePage/_profile-advertisements.scss";
import partners from "assets/img/auth-page/partners.svg";
import Loader from "../../UI/Loader";
import CarCard from "../../UI/CarCard";
import carService from "../../../services/car.service";
import { useAuth } from "../../context/authProvider";
import localStorageService from "../../../services/localStorage.service";

function ProfileAdvertisements() {
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [isError, setIsError] = useState(false);
  const { profileId } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "active";

  const isLikedTab = tab === "liked";
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileId) return;

    const fetchCars = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const data = await profileService.getProfileCars(profileId);
        setCars(data || []);
      } catch (err) {
        console.error("Fetch cars error:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const fetchFavorites = useCallback(async () => {
    setIsLoadingFavorites(true);
    try {
      const data = await profileService.getLikedCarsByProfileId(profileId);
      setFavorites(data || []);
      localStorageService.setFavoritesAds(data);
    } catch (err) {
      console.error("Fetch favorites error:", err);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, []);

  useEffect(() => {
    if (profileId && isLikedTab) {
      fetchFavorites();
    }
  }, [profileId, isLikedTab, fetchFavorites]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleDelete = async (carId) => {
    setIsLoading(true);
    try {
      await carService.deleteById(carId);

      setCars((prev) => prev.filter((c) => (c.id || c._id) !== carId));
      setFavorites((prev) => prev.filter((c) => (c.id || c._id) !== carId));
    } catch (err) {
      console.error("Delete car error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = (carId) => {
    setFavorites((prev) => prev.filter((car) => (car.id || car._id) !== carId));
  };

  const handleEdit = (car) => {
    const carId = car.id || car._id;
    navigate(`/profile/advertisements/edit/${carId}`, { state: { car } });
  };

  if (isError) return <Navigate to="/*" replace />;

  return (
    <article className="profile-ads">
      <nav className="profile-ads__navigation" aria-label="Profile tabs">
        <li className="profile-ads__navigation-item">
          <button
            type="button"
            className={`profile-ads__tab-btn ${
              !isLikedTab ? "link-active" : ""
            }`}
            onClick={() => handleTabChange("active")}
            aria-pressed={!isLikedTab}
          >
            Aktywne
          </button>
        </li>

        <li className="profile-ads__navigation-item">
          <button
            type="button"
            className={`profile-ads__tab-btn ${
              isLikedTab ? "link-active" : ""
            }`}
            onClick={() => handleTabChange("liked")}
            aria-pressed={isLikedTab}
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
            {!isLikedTab && (
              <>
                <h4 className="profile-ads__title">Aktywne ogłoszenia</h4>

                <div className="profile-ads__content-block">
                  {cars.length > 0 ? (
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
                              <CarCard
                                carInfo={car}
                                isProfileCard={true}
                                handles={{
                                  handleDelete,
                                  handleEdit,
                                }}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <div className="profile-ads__empty">
                      <img
                        className="profile-ads__add-img"
                        src={partners}
                        alt="Brak ogłoszeń"
                      />
                      <p>Nie masz jeszcze żadnych ogłoszeń.</p>
                      <Link to="/sellcar" className="profile-ads__browse-btn">
                        Dodaj pierwsze ogłoszenie
                      </Link>
                    </div>
                  )}
                  {cars.length > 0 && (
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
                  )}
                </div>
              </>
            )}

            {isLikedTab && (
              <>
                <h4 className="profile-ads__title">Ulubione ogłoszenia</h4>

                <div className="profile-ads__content-block">
                  {isLoadingFavorites ? (
                    <Loader />
                  ) : favorites.length > 0 ? (
                    <div className="profile-ads__content-list">
                      <ul className="profile-ads__list">
                        {favorites.map((fav) => {
                          return (
                            <li key={fav.id} className="profile-ads__list-item">
                              <CarCard
                                carInfo={fav}
                                isLiked={true}
                                onRemoveFavorite={handleRemoveFavorite}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <div className="profile-ads__empty">
                      <img
                        className="profile-ads__add-img"
                        src={partners}
                        alt="Brak ulubionych"
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
