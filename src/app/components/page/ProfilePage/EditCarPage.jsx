import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import carService from "services/car.service";
import "styles/profilePage/_edit-car-page.scss";

function EditCarPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const car = location.state?.car;
  if (!car) navigate("/profile/advertisements", { replace: true });

  const [formData, setFormData] = useState({
    name: car?.name || "",
    price: car?.price || "",
    year: car?.year || "",
    mileage: car?.mileage || "",
    description: car?.description || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const body = {
        name: formData.name,
        price: formData.price,
        year: formData.year,
        mileage: formData.mileage,
        description: formData.description,
      };

      await carService.updateCar(car.id || car._id, body);
      navigate("/profile/advertisements", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Wystąpił błąd podczas aktualizacji samochodu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="edit-car">
      <h2 className="edit-car__title">Edytuj ogłoszenie samochodu</h2>
      <form className="edit-car__form" onSubmit={handleSubmit}>
        <div className="edit-car__field">
          <label className="edit-car__label">Nazwa samochodu</label>
          <input
            className="edit-car__input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="edit-car__field">
          <label className="edit-car__label">Cena (PLN)</label>
          <input
            className="edit-car__input"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="edit-car__field">
          <label className="edit-car__label">Rok produkcji</label>
          <input
            className="edit-car__input"
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div className="edit-car__field">
          <label className="edit-car__label">Przebieg (km)</label>
          <input
            className="edit-car__input"
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            required
          />
        </div>
        <div className="edit-car__field">
          <label className="edit-car__label">Opis</label>
          <textarea
            className="edit-car__textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        {error && <p className="edit-car__error">{error}</p>}
        <button type="submit" disabled={isSaving} className="edit-car__btn">
          {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
        </button>
      </form>
    </section>
  );
}

export default EditCarPage;
