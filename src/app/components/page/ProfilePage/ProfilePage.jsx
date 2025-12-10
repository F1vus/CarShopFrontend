import { useEffect, useState } from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
  Outlet,
} from "react-router-dom";
import "styles/profilePage/_profile-page.scss";
import profileService from "services/profile.service";
import { useAuth } from "../../context/authProvider";

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileId, setProfileId] = useState(null);
  const [profile, setProfile] = useState(null);
  const {token} = useAuth();

  // --- auth / profile id fetch
  useEffect(() => {
    if (!token || token === "undefined") {
      navigate("/auth/register", { replace: true });
      return;
    }

    profileService
      .getProfileData(token)
      .then((profileData) => {
        setProfile(profileData);
        setProfileId(profileData?.id);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        if (err.status == 401) {
          navigate("/auth/register", { replace: true });
        }
      });
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/profile")) return;

    const parts = location.pathname.replace(/^\/+|\/+$/g, "").split("/"); // e.g. ["profile","messages","settings"]
    const child = parts[1] || ""; // "" when at /profile

    const allowed = new Set(["", "advertisements", "messages", "settings"]);

    if (parts.length > 2) {
      if (allowed.has(child)) {
        const target = child ? `/profile/${child}` : "/profile";
        if (location.pathname !== target) navigate(target, { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, []);

  const handleActivePage = (isActive) => {
    return "profile__navigation-link" + (isActive ? " link-active" : "");
  };

  return (
    <section className="profile">
      <header className="profile__header">
        <h2 className="profile__title">Twój profil</h2>
        <nav className="profile__navigation">
          <li className="profile__navigation-item">
            <NavLink
              to="/profile/advertisements"
              className={({ isActive }) => handleActivePage(isActive)}
              end
            >
              Ogłoszenia
            </NavLink>
          </li>
          <li className="profile__navigation-item">
            <NavLink
              to="/profile/messages"
              className={({ isActive }) => handleActivePage(isActive)}
            >
              Wiadomości
            </NavLink>
          </li>
          <li className="profile__navigation-item">
            <NavLink
              to="/profile/settings"
              className={({ isActive }) => handleActivePage(isActive)}
            >
              Ustawienia
            </NavLink>
          </li>
        </nav>
      </header>

      <div className="profile__content wide-container">
        <div className="container">
          <Outlet context={{ profile, setProfile, profileId }} />
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
