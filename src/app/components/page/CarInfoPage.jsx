import { useEffect, useState } from "react";
import carService from "../../services/car.service";

function CarInfoPage({ carId }) {
  const [carInfo, setCarInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    carService
      .getById(carId)
      .then((data) => {
        setCarInfo(data || {});
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Nie udało się załadować samochodów.");
      });
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <>
      <strong>{carInfo.name}</strong>
    </>
  );
}

export default CarInfoPage;
