import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import carService from "../../services/car.service";
import { useAuth } from "../context/authProvider";
import "styles/_sell-car-page.scss";

const DRAFT_KEY = "sellCarDraft_v1";

function SellCarPage() {
  const { isAuthenticated, profileId, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    color: "",
    mileage: "",
    carState: "",
    petrolType: "",
    engineCapacity: "",
    power: "",
    year: "",
    photos: "",
    producent: "",
    hadAccidents: false,
  });

  const [metadata, setMetadata] = useState({
    color: [],
    carState: [],
    petrolType: [],
    producent: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // draft helpers (omitted for brevity in this snippet; keep your existing ones)
  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.warn("Failed to parse sell car draft", err);
      return null;
    }
  };
  const saveDraft = (data) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn("Failed to save draft", err);
    }
  };
  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      console.warn("Failed to clear draft", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function getMetadata() {
      try {
        const data = await carService.getMetadata();
        const normalized = {
          color: data.colors || data.color || [],
          petrolType: data.petrols || data.petrolType || [],
          producent: data.producers || data.producent || [],
          carState: data.carStates || data.carState || [],
        };
        if (!mounted) return;
        setMetadata(normalized);
      } catch (err) {
        console.error("Error fetching metadata for form:", err);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
        const draft = loadDraft();
        if (draft) setFormData((prev) => ({ ...prev, ...draft }));
      }
    }
    getMetadata();
    return () => {
      mounted = false;
    };
  }, []);

  // handle change same as before (checkbox support)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData((prev) => {
      const next = { ...prev, [name]: fieldValue };
      saveDraft(next);
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nazwa samochodu jest wymagana";
    if (!formData.producent) newErrors.producent = "Producent jest wymagany";
    if (!formData.description) newErrors.description = "Opis jest wymagany";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Cena musi być większa niż 0";
    if (!formData.year || Number(formData.year) <= 0)
      newErrors.year = "Rok jest wymagany";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => /^https?:\/\/.+/.test(url);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // if not authenticated -> save draft and redirect to login
    if (!isAuthenticated) {
      saveDraft(formData);
      navigate("/auth/login", {
        state: {
          from: location.pathname,
          message:
            "Musisz się zalogować, aby wystawić ogłoszenie. Twoje dane zostały zapisane.",
        },
      });
      return;
    }

    const photoUrls = formData.photos
      ? formData.photos
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean)
      : [];

    for (const url of photoUrls) {
      if (!isValidUrl(url)) {
        setErrors((prev) => ({ ...prev, photos: "Niepoprawny URL zdjęcia" }));
        return;
      }
    }

    const getFullObject = (id, metadataArray) => {
      if (!id) return null;
      const item = metadataArray.find(
        (item) =>
          item.id === Number(id) ||
          item.colorID === Number(id) ||
          item.petrolID === Number(id)
      );
      return item
        ? { id: item.id || item.colorID || item.petrolID, name: item.name }
        : null;
    };

    // Build payload: include the user's id so DB constraint is satisfied.
    // Adjust property names to match backend expectations.
    const payload = {
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      mileage: formData.mileage ? Number(formData.mileage) : null,
      engineCapacity: formData.engineCapacity
        ? Number(formData.engineCapacity)
        : null,
      power: formData.power ? Number(formData.power) : null,
      year: Number(formData.year),
      carState: formData.carState || null,
      color: getFullObject(formData.color, metadata.color),
      petrolType: getFullObject(formData.petrolType, metadata.petrolType),
      producent: getFullObject(formData.producent, metadata.producent),
      photos: photoUrls.map((url) => ({ url })),
      hadAccidents: formData.hadAccidents || false,
      // important: user reference (choose one your backend expects)
      usersProfilesId: profileId ? Number(profileId) : undefined,
      users_profiles_id: profileId ? Number(profileId) : undefined,
      ownerId: profileId ? Number(profileId) : undefined,
      // if your backend expects an object:
      owner: profileId ? { id: Number(profileId) } : undefined,
    };

    // remove undefined fields to keep payload clean
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k]
    );

    try {
      setIsSubmitting(true);
      // pass auth headers from context if available
      const headers =
        typeof getAuthHeaders === "function" ? getAuthHeaders() : {};
      await carService.createCar(payload, { headers });

      clearDraft();
      setFormData({
        name: "",
        price: "",
        description: "",
        color: "",
        mileage: "",
        carState: "",
        petrolType: "",
        engineCapacity: "",
        power: "",
        year: "",
        photos: "",
        producent: "",
        hadAccidents: false,
      });

      alert("Samochód został wystawiony!");
    } catch (err) {
      console.error("Create car error:", err);

      const status = err.response?.status;
      if (status === 401) {
        saveDraft(formData);
        navigate("/auth/login", {
          state: {
            from: location.pathname,
            message:
              "Twoja sesja wygasła lub nie jesteś zalogowany. Twoje dane zostały zapisane.",
          },
        });
        return;
      }

      const serverErrors = err.response?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        const mapped = {};
        Object.keys(serverErrors).forEach((k) => {
          mapped[k] = Array.isArray(serverErrors[k])
            ? serverErrors[k].join(", ")
            : String(serverErrors[k]);
        });
        setErrors((prev) => ({ ...prev, ...mapped }));
      } else {
        alert(
          err.response?.data?.message ||
            "Błąd podczas tworzenia ogłoszenia. Twoje dane zostały zapisane."
        );
      }
      saveDraft(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    clearDraft();
    setFormData({
      name: "",
      price: "",
      description: "",
      color: "",
      mileage: "",
      carState: "",
      petrolType: "",
      engineCapacity: "",
      power: "",
      year: "",
      photos: "",
      producent: "",
      hadAccidents: false,
    });
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="sell-car">
        <h1>Ładowanie danych formularza...</h1>
      </div>
    );
  }

  return (
    <div className="sell-car">
      <header className="sell-car__header">Sprzedaj swój samochód</header>
      <h1 className="sell-car__subtitle">
        Wypełnij poniższy formularz, aby wystawić swój samochód na sprzedaż.
      </h1>

      <form className="sell-car__form" onSubmit={handleSubmit}>
        <h2 className="sell-car__basic-info-heading">Podstawowe informacje</h2>

        <div className="sell-car__basic-info">
          <div className="form-item">
            <label htmlFor="carName">Nazwa samochodu</label>
            <input
              type="text"
              id="carName"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-item">
            <label htmlFor="price">Cena</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <div className="field-error">{errors.price}</div>}
          </div>

          <div className="form-item">
            <label htmlFor="manufacturer">Producent</label>
            <select
              id="manufacturer"
              name="producent"
              value={formData.producent}
              onChange={handleChange}
            >
              <option value="">Wybierz producenta</option>
              {metadata.producent &&
                metadata.producent.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
            {errors.producent && (
              <div className="field-error">{errors.producent}</div>
            )}
          </div>

          <div className="form-item">
            <label htmlFor="year">Rok</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />
            {errors.year && <div className="field-error">{errors.year}</div>}
          </div>
        </div>

        <h2 className="sell-car__specs-heading">Specyfikacje techniczne</h2>
        <div className="sell-car__specs">
          <div className="form-item">
            <label htmlFor="mileage">Przebieg (km)</label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
            />
            {errors.mileage && (
              <div className="field-error">{errors.mileage}</div>
            )}
          </div>

          <div className="form-item">
            <label htmlFor="engineCapacity">Pojemność silnika (l)</label>
            <input
              type="number"
              id="engineCapacity"
              name="engineCapacity"
              value={formData.engineCapacity}
              onChange={handleChange}
            />
          </div>

          <div className="form-item">
            <label htmlFor="power">Moc</label>
            <input
              type="number"
              id="power"
              name="power"
              value={formData.power}
              onChange={handleChange}
            />
          </div>

          <div className="form-item">
            <label htmlFor="fuelType">Rodzaj paliwa</label>
            <select
              id="fuelType"
              name="petrolType"
              value={formData.petrolType}
              onChange={handleChange}
            >
              <option value="">Wybierz paliwo</option>
              {metadata.petrolType &&
                metadata.petrolType.map((item) => (
                  <option
                    key={item.id || item.petrolID}
                    value={item.id || item.petrolID}
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <h2 className="sell-car__appearance-heading">Wygląd i stan</h2>

        <div className="sell-car__appearance">
          <div className="form-item">
            <label htmlFor="color">Kolor</label>
            <select
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            >
              <option value="">Wybierz kolor</option>
              {metadata.color &&
                metadata.color.map((item) => (
                  <option
                    key={item.id || item.colorID}
                    value={item.id || item.colorID}
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-item">
            <label htmlFor="carState">Stan samochodu</label>
            <select
              id="carState"
              name="carState"
              value={formData.carState}
              onChange={handleChange}
            >
              <option value="">Wybierz stan</option>
              {metadata.carState &&
                metadata.carState.map((item, idx) => (
                  <option key={item.id || idx} value={item.id ?? item}>
                    {item.name ?? item}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="sell-car__additional-info">
          <div className="form-item checkbox-item">
            <input
              type="checkbox"
              id="hadAccidents"
              name="hadAccidents"
              checked={formData.hadAccidents}
              onChange={handleChange}
            />
            <label htmlFor="hadAccidents">Samochód miał wypadki</label>
          </div>
        </div>

        <div className="sell-car__buttons">
          <button
            className="sell-car__clear-btn"
            type="button"
            onClick={handleReset}
          >
            Wyczyść
          </button>

          <button
            className="sell-car__submit-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wysyłanie..." : "Wystaw moje auto"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SellCarPage;
