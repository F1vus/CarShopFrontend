import { useEffect, useState } from "react";
import "styles/_cars-page.scss";
import carService from "../../services/car.service";
import CarCard from "../UI/CarCard";
import Loader from "../UI/Loader";
import CarInfoPage from "./CarInfoPage";
import { useParams } from "react-router-dom";

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams();
  const { carId } = params;

  useEffect(() => {
    setIsLoading(true);
    carService
      .getAll()
      .then((data) => {
        setCars(data || []);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Nie udało się załadować samochodów.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (error) return <p>{error}</p>;
  if (!isLoaded || cars.length === 0) return <p>Brak samochodów</p>;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : carId ? (
        <CarInfoPage carId={carId} />
      ) : (
        <div className="cars-page">
          <aside className="filtration-form"></aside>
          <div className="cars-cards">
            {cars.map((carData) => (
              <CarCard key={carData.id} carInfo={carData} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default CarsPage;
