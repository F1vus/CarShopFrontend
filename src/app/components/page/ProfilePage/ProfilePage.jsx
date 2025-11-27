import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "styles/_profilePage.scss";
import profileService from "services/profile.service";

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cars, setCars] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === "undefined") {
      navigate("/");
      return;
    }

    profileService
      .getProfileId(token)
      .then((data) => {
        setProfileId(data.id);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
      });
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!profileId) return;

    profileService
      .getProfileCars(profileId)
      .then((data) => {
        setCars(data || []);
      })
      .catch((err) => {
        console.error("Fetch cars error:", err);
        setError(true);
      });
  }, [profileId]);

  if (error) return <Navigate to="/*" replace />;

  return (
    <section className="profile">
      <header className="profile__header">
        <h2 className="profile__title">Twoje ogłoszenia</h2>
        <nav className="profile__navigation">
          <li className="profile__navigation-item">
            <Link className="profile__navigation-link navigation-link">
              Ogłoszenia
            </Link>
          </li>
          <li className="profile__navigation-item">
            <Link className="profile__navigation-link navigation-link">
              Wiadomości
            </Link>
          </li>
          <li className="profile__navigation-item">
            <Link className="profile__navigation-link navigation-link">
              Ustawienia
            </Link>
          </li>
        </nav>
      </header>
      <div className="profile__content">
        
      </div>
    </section>
  );
}

export default ProfilePage;
