import { useEffect, useState } from "react";
import "styles/_cars-page.scss";
import carService from "../../services/car.service";
import CarCard from "../UI/CarCard";
import Loader from "../UI/Loader";
import CarInfoPage from "./CarInfoPage";
import { Navigate, useLocation, useParams } from "react-router-dom";
import FiltrationForm from "../UI/FiltrationForm";
import paginate from "../../utils/paginate";
import Pagination from "../UI/Pagination";

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // items per page

  const params = useParams();
  const location = useLocation();
  const { carId } = params;

  useEffect(() => {
    carService
      .getAll()
      .then((data) => {
        setCars(data || []);
        setCurrentPage(1);
        setIsLoaded(true)
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
      })
  }, [location.pathname]);

  if (error) return <Navigate to="/*" replace />;

  const paginatedCars = paginate(cars, currentPage, pageSize);
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <>
      {isLoaded && cars.length > 0 ? (
        <>
          {carId ? (
            <CarInfoPage carId={carId} />
          ) : (
            <div className="cars-page">
              <aside className="filtration-form-aside">
                <FiltrationForm />
              </aside>
              <section className="content">
                <div className="cars-cards">
                  {paginatedCars.map((carData) => (
                    <CarCard key={carData.id} carInfo={carData} />
                  ))}
                </div>
                <Pagination
                  itemsCount={cars.length}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                />
              </section>
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default CarsPage;
