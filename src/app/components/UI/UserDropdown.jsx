import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authProvider";

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { isAuthenticated, logout, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout({
        redirect: true,
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Link to="/auth/register" className="navbar__link">
        <i className="fa-regular fa-user" aria-hidden="true"></i>
        <span className="navbar__icons-text">Zrejestruj się</span>
      </Link>
    );
  }

  return (
    <div className="navbar__dropdown" ref={dropdownRef}>
      <button
        className="navbar__dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Menu użytkownika"
      >
        <i className="fa-regular fa-user" aria-hidden="true"></i>
        <span className="navbar__icons-text">Mój profil</span>
        <i className={`fa-solid fa-chevron-${isOpen ? "up" : "down"}`}></i>
      </button>

      {isOpen && (
        <div className="navbar__dropdown-menu">
          <div className="navbar__dropdown-header">
            <span>Witaj!</span>
          </div>

          <Link
            to="/profile/advertisements?tab=liked"
            className="navbar__dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <div className="dropdown-item-content">
              <i className="bi bi-heart-fill"></i>
              <span>Ulubione</span>
            </div>
          </Link>

          <Link
            to="/profile/advertisements?tab=active"
            className="navbar__dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <div className="dropdown-item-content">
              <i className="fa-solid fa-car"></i>
              <span>Moje ogłoszenia</span>
            </div>
          </Link>

          <Link
            to="/profile/settings"
            className="navbar__dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <div className="dropdown-item-content">
              <i className="fa-solid fa-gear"></i>
              <span>Ustawienia</span>
            </div>
          </Link>

          <div className="navbar__dropdown-divider"></div>

          <button
            className="navbar__dropdown-item navbar__dropdown-item--logout"
            onClick={handleLogout}
          >
            <div className="dropdown-item-content">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>{authLoading ? "Wylogowywanie..." : "Wyloguj się"}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
