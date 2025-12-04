import { useEffect, useState } from "react";
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  Outlet,
} from "react-router-dom";
import "styles/profilePage/_profile-page.scss";
import profileService from "services/profile.service";
import ProfileAdvertisements from "./ProfileAdvertisements";
import ProfileMessages from "./ProfileMessages";
import ProfileSettings from "./ProfileSettings";
import EditCarPage from "./EditCarPage";

function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileId, setProfileId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // --- auth / profile id fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      navigate("/", { replace: true });
      return;
    }

    setLoading(true);
    profileService
      .getProfileData(token)
      .then((profileData) => {
        setProfile(profileData);
        console.log(profileData);
        
        setProfileId(profileData?.id);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
        if (err.status == 401) {
          navigate("/auth/register", { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // --- sanitize nested path (prevent /profile/messages/settings etc.)
  useEffect(() => {
    // only operate for routes that start with /profile
    if (!location.pathname.startsWith("/profile")) return;

    // normalize and split
    const parts = location.pathname.replace(/^\/+|\/+$/g, "").split("/"); // e.g. ["profile","messages","settings"]
    // parts[0] === "profile"
    const child = parts[1] || ""; // "" when at /profile

    // allowed first-level children under /profile
    const allowed = new Set(["", "advertisements", "messages", "settings"]);

    if (parts.length > 2) {
      // there are extra nested segments -> redirect to the canonical first-level route
      if (allowed.has(child)) {
        const target = child ? `/profile/${child}` : "/profile";
        if (location.pathname !== target) navigate(target, { replace: true });
      } else {
        // unknown child, send to base /profile
        navigate("/profile", { replace: true });
      }
    }
    // }, [location.pathname, navigate]);
  }, []);

  const handleActivePage = (isActive) => {
    return "profile__navigation-link" + (isActive ? " link-active" : "");
  };

  if (error) return <Navigate to="/*" replace />;

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
          <Outlet context={{profile, setProfile, profileId}} />
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
