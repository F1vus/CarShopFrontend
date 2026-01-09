import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useDeviceMode from "../common/useDeviceMode";
import "styles/_filtration-form.scss";
import carService from "../../services/car.service";

const defaultForm = {
  priceFrom: "",
  priceTo: "",
  yearFrom: "",
  yearTo: "",
  mileageFrom: "",
  mileageTo: "",
  color: "",
  fuelType: "",
  producer: "", // new producer field (producer id)
};

function FiltrationForm({ variant = "auto" }) {
  const device = useDeviceMode();
  const activeVariant = variant === "auto" ? device : variant;
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [metadata, setMetadata] = useState({});
  const [formValues, setFormValues] = useState(defaultForm);

  // load metadata (colors, petrols, producers, etc.)
  useEffect(() => {
    let mounted = true;
    async function getMetadata() {
      try {
        const data = await carService.getMetadata();
        if (mounted) setMetadata(data);
      } catch (err) {
        console.error("Error fetching metadata for filtration:", err);
      }
    }
    getMetadata();
    return () => (mounted = false);
  }, []);

  // initialize form from URL search params
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFormValues((prev) => ({
      ...prev,
      ...Object.keys(defaultForm).reduce((acc, key) => {
        if (params[key] !== undefined) acc[key] = params[key];
        return acc;
      }, {}),
    }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.keys(defaultForm).forEach((p) => newParams.delete(p));
    // reset page if you use page param
    newParams.delete("page");
    setSearchParams(newParams);
    setFormValues(defaultForm);
  };

  const handleSubmitFiltration = (e) => {
    e.preventDefault();

    // get current params (if on cars page)
    const newParams =
      location.pathname === "/cars"
        ? new URLSearchParams(searchParams.toString())
        : new URLSearchParams();

    // clear previous filter keys
    Object.keys(defaultForm).forEach((p) => newParams.delete(p));

    // set new filter keys (only non-empty)
    Object.entries(formValues).forEach(([k, v]) => {
      if (v !== "" && v != null && v !== undefined) {
        newParams.set(k, String(v).trim());
      }
    });

    newParams.delete("page");

    if (location.pathname !== "/cars") {
      navigate(`/cars?${newParams.toString()}`);
    } else {
      setSearchParams(newParams);
    }
  };

  return (
    <section className={`filtration-form filtration-form--${activeVariant}`}>
      <h3 className="filtration-form__title">Samochody Osobowe</h3>

      <form className="filtration-form__body" onSubmit={handleSubmitFiltration}>
        <div className="filtration-form__row filtration-form__row--selects">
          <div className="filtration-form__field">
            <label className="filtration-form__label">Producent</label>
            <select
              className="filtration-form__input"
              name="producer"
              value={formValues.producer}
              onChange={handleChange}
            >
              <option value="">Wszyscy</option>
              {metadata.producers &&
                metadata.producers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="filtration-form__field">
            <label className="filtration-form__label">Rodzaj paliwa</label>
            <select
              className="filtration-form__input"
              name="fuelType"
              value={formValues.fuelType}
              onChange={handleChange}
            >
              <option value="">Wszystkie</option>
              {metadata.petrols &&
                metadata.petrols.map((petrol) => (
                  <option key={petrol.petrolID} value={petrol.petrolID}>
                    {petrol.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="filtration-form__field">
            <label className="filtration-form__label">Kolor pojazdu</label>
            <select
              className="filtration-form__input"
              name="color"
              value={formValues.color}
              onChange={handleChange}
            >
              <option value="">Wszystkie</option>
              {metadata.colors &&
                metadata.colors.map((color) => (
                  <option key={color.colorID} value={color.colorID}>
                    {color.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="filtration-form__row">
          <div className="filtration-form__field">
            <label className="filtration-form__label">Cena od</label>
            <input
              type="number"
              className="filtration-form__input"
              placeholder="Cena od"
              name="priceFrom"
              value={formValues.priceFrom}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="filtration-form__field">
            <label className="filtration-form__label">Cena do</label>
            <input
              type="number"
              className="filtration-form__input"
              placeholder="Cena do"
              name="priceTo"
              value={formValues.priceTo}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="filtration-form__row">
          <div className="filtration-form__field">
            <label className="filtration-form__label">Rok produkcji od</label>
            <input
              type="number"
              className="filtration-form__input"
              placeholder="Rok produkcji od"
              name="yearFrom"
              value={formValues.yearFrom}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="filtration-form__field">
            <label className="filtration-form__label">Rok produkcji do</label>
            <input
              type="number"
              className="filtration-form__input"
              placeholder="Rok produkcji do"
              name="yearTo"
              value={formValues.yearTo}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="filtration-form__row">
          <div className="filtration-form__field">
            <label className="filtration-form__label">Przebieg od</label>
            <input
              type="number"
              className="filtration-form__input"
              placeholder="Przebieg od"
              name="mileageFrom"
              value={formValues.mileageFrom}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="filtration-form__field">
            <label className="filtration-form__label">Przebieg do</label>
            <input
              type="number"
              className="filtration-form__input"
              placeholder="Przebieg do"
              name="mileageTo"
              value={formValues.mileageTo}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="filtration-form__actions">
          <button className="filtration-form__btn" type="submit">
            Pokaż Wszystkie Ogłoszenia
          </button>
          <button
            type="button"
            className="filtration-form__btn filtration-form__btn--clear"
            onClick={clearFilters}
          >
            Wyczyść filtry
          </button>
        </div>
      </form>
    </section>
  );
}

export default FiltrationForm;
