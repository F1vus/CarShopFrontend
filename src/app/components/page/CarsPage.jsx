import { useEffect, useState } from "react";
import "styles/_cars-page.scss";
import carService from "../../services/car.service";
import CarCard from "../UI/CarCard";
import Loader from "../UI/Loader";
import CarInfoPage from "./CarInfoPage";
import { Navigate, useParams } from "react-router-dom";

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const params = useParams();
  const { carId } = params;

  useEffect(() => {
    setIsLoading(true);
    carService
      .getAll()
      .then((data) => {
        setCars(data || []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (error) return <Navigate to="/*" replace />;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {carId ? (
            <CarInfoPage carId={carId} />
          ) : (
            <div className="cars-page">
              <aside className="filtration-form">
                <form
                  className="filtration-inner"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="form-field">
                    <label className="heading">Szczegóły</label>
                    <textarea placeholder="Szczegóły" />
                  </div>

                  <div className="form-field" style={{ marginTop: 12 }}>
                    <label className="heading">Model pojazdu</label>
                    <select>
                      <option>Model pojazdu</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label className="heading">Cena od</label>
                      <input placeholder="Cena od" />
                    </div>
                    <div className="form-field">
                      <label className="heading">Cena do</label>
                      <input placeholder="Cena do" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label className="heading">Rok produkcji od</label>
                      <input placeholder="Rok produkcji od" />
                    </div>
                    <div className="form-field">
                      <label className="heading">Rok produkcji do</label>
                      <input placeholder="Rok produkcji do" />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="heading">Rodzaj paliwa</label>
                    <select>
                      <option>Rodzaj paliwa</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label className="heading">Przebieg od</label>
                      <input placeholder="Przebieg od" />
                    </div>
                    <div className="form-field">
                      <label className="heading">Przebieg do</label>
                      <input placeholder="Przebieg do" />
                    </div>
                  </div>

                  <button className="show-btn" type="submit">
                    Pokaż Wszystkie Ogłoszenia
                  </button>
                </form>
              </aside>
              <div className="cars-cards">
                {cars.map((carData) => (
                  <CarCard key={carData.id} carInfo={carData} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default CarsPage;