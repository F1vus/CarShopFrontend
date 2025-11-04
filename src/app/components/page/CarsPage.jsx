import { useEffect, useState } from "react";
import "styles/_cars-page.scss";
import carsApi from "../../api/fakeAPI/cars.api";
import CarCard from "../UI/CarCard";
import Loader from "../UI/Loader";

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    carsApi
      .getAllCars()
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

  if (isLoading) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!isLoaded || cars.length === 0) return <p>Brak samochodów</p>;

  return (
    <div className="cars-page">
      <aside className="filtration-form">
      </aside>
      <div className="cars-cards">
        {cars.map((carData) => (
          <CarCard key={carData.id} carInfo={carData} />
        ))}
      </div>
    </div>
  );
}

export default CarsPage;
