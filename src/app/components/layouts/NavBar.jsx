import { useState, useEffect, useRef } from "react";
import "assets/styles/_navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import siteLogo from "assets/img/logo-large.svg";
import carService from "services/car.service.js";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // search states
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const searchInputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setSuggestions([]);
        setHighlightIndex(-1);
      }
    };

    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // click outside handler closes suggestion list
  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setSuggestions([]);
        setHighlightIndex(-1);
        setSearchOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // debounce + request logic
  useEffect(() => {
    // clear previous timer
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      requestIdRef.current += 1;
      return;
    }

    setLoading(true);
    const thisRequestId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await carService.findSuggestion(query.trim());
        if (thisRequestId !== requestIdRef.current) return;
        setSuggestions(Array.isArray(res) ? res : []);
      } catch (err) {
        if (thisRequestId !== requestIdRef.current) return;
        console.error("Błąd pobierania sugestii:", err);
        setSuggestions([]);
      } finally {
        if (thisRequestId === requestIdRef.current) setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const closeMenu = () => setMenuOpen(false);

  const onSelectSuggestion = (car) => {
    // Navigate programmatically so we can also clear state
    setQuery("");
    setSuggestions([]);
    setHighlightIndex(-1);
    setSearchOpen(false);
    navigate(`/cars/${car.id}`);
  };

  const onInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        e.preventDefault();
        onSelectSuggestion(suggestions[highlightIndex]);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightIndex(-1);
    }
  };

  // onBlur handler for input: zamyka sugestie jeśli fokus NIE przeszedł do elementu w containerRef
  const handleInputBlur = (e) => {
    const related = e.relatedTarget;
    if (
      !related ||
      !containerRef.current ||
      !containerRef.current.contains(related)
    ) {
      setSuggestions([]);
      setHighlightIndex(-1);
      setSearchOpen(false);
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar__container">
        <div className="navbar__left">
          <button
            className={`navbar__hamburger ${menuOpen ? "is-open" : ""}`}
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((s) => !s)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="navbar__logo">
            <Link
              to="/home"
              className="navbar__link"
              aria-label="Strona główna"
            >
              <img src={siteLogo} alt="CarShop" />
            </Link>
          </div>
        </div>

        <nav
          className={`navbar__menu ${menuOpen ? "is-open" : ""}`}
          aria-label="Główne"
        >
          <div className="navbar__menu-logo" onClick={closeMenu}>
            <Link
              to="/home"
              className="navbar__link"
              aria-label="Strona główna"
            >
              <img src={siteLogo} alt="CarShop" />
            </Link>
          </div>

          <div className="navbar__item">
            <Link to="/sellcar" className="navbar__link" onClick={closeMenu}>
              Zacznij Sprzedawać
            </Link>
          </div>
          <div className="navbar__item">
            <Link to="/cars" className="navbar__link" onClick={closeMenu}>
              Samochody
            </Link>
          </div>
          <div className="navbar__item">
            <Link to="/contacts" className="navbar__link" onClick={closeMenu}>
              Kontakty
            </Link>
          </div>
        </nav>

        <div className="navbar__actions">
          {/* SEARCH CONTAINER */}
          <div className="navbar__search-container" ref={containerRef}>
            <div className={`navbar__search ${searchOpen ? "is-open" : ""}`}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Szukaj"
                aria-label="Szukaj"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlightIndex(-1);
                }}
                onKeyDown={onInputKeyDown}
                onFocus={() => setSearchOpen(true)}
                onBlur={handleInputBlur}
              />
              <button
                type="button"
                className="navbar__search-toggle"
                aria-label={
                  searchOpen ? "Zamknij wyszukiwanie" : "Otwórz wyszukiwanie"
                }
                onClick={() => {
                  setSearchOpen((s) => !s);
                }}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            {searchOpen && query.trim().length >= 2 && (
              <ul
                className="navbar__suggestions"
                role="listbox"
                aria-label="Sugestie wyszukiwania"
                tabIndex={-1}
              >
                {loading && (
                  <li className="navbar__suggestion--loading">Ładowanie...</li>
                )}

                {!loading && suggestions.length === 0 && (
                  <li className="navbar__suggestion--empty">Brak wyników</li>
                )}

                {!loading &&
                  suggestions.map((car, idx) => (
                    <li
                      key={car.id}
                      role="option"
                      aria-selected={highlightIndex === idx}
                      className={`navbar__suggestion ${
                        highlightIndex === idx ? "is-highlight" : ""
                      }`}
                      onMouseEnter={() => setHighlightIndex(idx)}
                      onMouseLeave={() => setHighlightIndex(-1)}
                    >
                      <Link
                        to={`/cars/${car.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectSuggestion(car);
                        }}
                      >
                        <div className="navbar__suggestion-meta">
                          <div className="navbar__suggestion-title">
                            {car.name}
                          </div>
                          <div className="navbar__suggestion-price">
                            {car.price} PLN
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="navbar__icons">
            <div className="navbar__icons-item">
              <Link to="/basket" className="navbar__link">
                <i className="fa-solid fa-cart-shopping" aria-hidden="true"></i>
                <span className="navbar__icons-text">Koszyk</span>
              </Link>
            </div>
            <div className="navbar__icons-item">
              <Link to="/auth/register" className="navbar__link">
                <i className="fa-regular fa-user" aria-hidden="true"></i>
                <span className="navbar__icons-text">Zrejestruj się</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`navbar__backdrop ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
    </header>
  );
}

export default NavBar;
