import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import carService from "../../services/car.service";
import { useAuth } from "../context/authProvider";
import "styles/_sell-car-page.scss";
import PhotoUploadModal from "../UI/PhotoUploadModal";

const DRAFT_KEY = "sellCarDraft_v1";
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

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
    producent: "",
    hadAccidents: false,
  });

  // images: { id, file, previewUrl, status, error }
  const [images, setImages] = useState([]);
  const imagesIdRef = useRef(0);

  const [metadata, setMetadata] = useState({
    color: [],
    carState: [],
    petrolType: [],
    producent: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Draft helpers
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
          color: data.colors || [],
          petrolType: data.petrols || [],
          producent: data.producers || [],
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
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);

  // handle change (checkbox support)
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

  // local car states
  const LOCAL_CAR_STATES = [
    { id: "POOR", name: "POOR" },
    { id: "USED", name: "USED" },
    { id: "NEW", name: "NEW" },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nazwa samochodu jest wymagana";
    if (!formData.producent) newErrors.producent = "Producent jest wymagany";
    if (!formData.description) newErrors.description = "Opis jest wymagany";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Cena musi być większa niż 0";
    if (!formData.year || Number(formData.year) <= 0)
      newErrors.year = "Rok jest wymagany";
    if (!formData.carState) newErrors.carState = "Wybierz stan samochodu";

    // image-side client validation errors
    const imageErrors = images.map((img) => img.error).filter(Boolean);
    if (imageErrors.length > 0) newErrors.photos = imageErrors.join("; ");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Image helpers
  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const added = files.map((file) => {
      const id = imagesIdRef.current++;
      let error = null;
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        error = "Nieobsługiwany typ obrazu (wspierane: jpeg, webp, png)";
      } else if (file.size > MAX_IMAGE_SIZE) {
        error = "Plik jest za duży (maks. 5 MB)";
      }
      const previewUrl = URL.createObjectURL(file);
      return {
        id,
        file,
        previewUrl,
        status: error ? "error" : "idle",
        error,
      };
    });
    setImages((prev) => {
      const next = [...prev, ...added];
      saveDraft({ ...formData, _imagesCount: next.length });
      return next;
    });
    if (errors.photos) setErrors((prev) => ({ ...prev, photos: undefined }));
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const toRemove = prev.find((p) => p.id === id);
      if (toRemove && toRemove.previewUrl) {
        URL.revokeObjectURL(toRemove.previewUrl);
      }
      const next = prev.filter((im) => im.id !== id);
      saveDraft({ ...formData, _imagesCount: next.length });
      return next;
    });
  };

  const getId = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  };

  // Build and send multipart/form-data request: "car" part (JSON) + "photos" parts (files)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!isAuthenticated) {
      saveDraft({ ...formData, _imagesCount: images.length });
      navigate("/auth/login", {
        state: {
          from: location.pathname,
          message:
            "Musisz się zalogować, aby wystawić ogłoszenie. Twoje dane zostały zapisane.",
        },
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const headers =
        typeof getAuthHeaders === "function" ? getAuthHeaders() : {};

      const carPayload = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        mileage: formData.mileage ? Number(formData.mileage) : null,
        engineCapacity: formData.engineCapacity
          ? Number(formData.engineCapacity)
          : null,
        power: formData.power ? Number(formData.power) : null,
        year: Number(formData.year),
        carState: formData.carState || null, // string: POOR/USED/NEW
        color: getId(formData.color), // sends numeric id or null
        petrolType: getId(formData.petrolType), // numeric id or null
        producent: getId(formData.producent), // numeric id or null
        hadAccidents: !!formData.hadAccidents,
      };

      Object.keys(carPayload).forEach(
        (k) =>
          (carPayload[k] === undefined || carPayload[k] === null) &&
          delete carPayload[k]
      );

      const form = new FormData();
      const carBlob = new Blob([JSON.stringify(carPayload)], {
        type: "application/json",
      });
      form.append("car", carBlob);

      images.forEach((img) => {
        if (img.file && img.status !== "error") {
          form.append("photos", img.file);
        }
      });

      // ensuring that headers do not set Content-Type
      const safeHeaders = { ...(headers || {}) };
      if (safeHeaders["Content-Type"] || safeHeaders["content-type"]) {
        delete safeHeaders["Content-Type"];
        delete safeHeaders["content-type"];
      }

      await carService.createCar(form, { headers: safeHeaders });

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
        producent: "",
        hadAccidents: false,
      });
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
      setImages([]);
    } catch (err) {
      console.error("Create car error:", err);

      const status = err.response?.status;
      if (status === 401) {
        saveDraft({ ...formData, _imagesCount: images.length });
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
        setErrors((prev) => ({
          ...prev,
          photos:
            err.message ||
            err.response?.data?.message ||
            "Błąd podczas tworzenia ogłoszenia. Twoje dane zostały zapisane.",
        }));
      }
      saveDraft({ ...formData, _imagesCount: images.length });
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
      producent: "",
      hadAccidents: false,
    });
    images.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
    });
    setImages([]);
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
              {LOCAL_CAR_STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
              {metadata.carState &&
                metadata.carState.map((item, idx) => (
                  <option key={item.id ?? idx} value={item.id ?? item}>
                    {item.name ?? item}
                  </option>
                ))}
            </select>
            {errors.carState && (
              <div className="field-error">{errors.carState}</div>
            )}
          </div>
        </div>

        <div className="sell-car__description-photos">
          <div className="form-item">
            <label htmlFor="description">Opis</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Napisz opis samochodu..."
            />
            {errors.description && (
              <div className="field-error">{errors.description}</div>
            )}
          </div>

          <div className="form-item">
            <label>Zdjęcia</label>
            <div>
              <button
                type="button"
                className="sell-car__clear-btn"
                onClick={() => setShowPhotoModal(true)}
              >
                Zarządzaj zdjęciami ({images.length})
              </button>
              <div className="photo-modal__meta-note" style={{ marginTop: 8 }}>
                <small>
                  Wspierane typy: jpeg, webp, png. Maksymalny rozmiar: 5MB /
                  zdjęcie.
                </small>
              </div>
              {errors.photos && (
                <div className="field-error">{errors.photos}</div>
              )}
            </div>

            <div className="photo-modal__thumbnails" style={{ marginTop: 12 }}>
              {images.length === 0 && <div>Brak wybranych zdjęć.</div>}
              {images.map((img) => (
                <div className="photo-modal__thumb" key={img.id}>
                  <div className="photo-modal__thumb-img">
                    <img src={img.previewUrl} alt="preview" />
                  </div>

                  <div className="photo-modal__thumb-controls">
                    <button type="button" onClick={() => removeImage(img.id)}>
                      Usuń
                    </button>
                    <div className="photo-modal__status">
                      {img.status === "uploading" && "Wysyłanie..."}
                      {img.status === "uploaded" && "Wysłane"}
                      {img.status === "error" && "Błąd"}
                      {img.status === "idle" && "Gotowy"}
                    </div>
                  </div>

                  {img.error && (
                    <div className="photo-modal__thumb-error">{img.error}</div>
                  )}
                </div>
              ))}
            </div>
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

      {showPhotoModal && (
        <PhotoUploadModal
          onClose={() => setShowPhotoModal(false)}
          onAddFiles={(files) => addFiles(files)}
          images={images}
          onRemove={removeImage}
        />
      )}
    </div>
  );
}

export default SellCarPage;
