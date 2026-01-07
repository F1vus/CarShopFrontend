import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import "styles/_cars-page.scss";
import carService from "../../services/car.service";
import CarCard from "../UI/CarCard";
import Loader from "../UI/Loader";
import CarInfoPage from "./CarInfoPage";
import { Navigate } from "react-router-dom";
import FiltrationForm from "../UI/FiltrationForm";
import paginate from "../../utils/paginate";
import Pagination from "../UI/Pagination";
import noResultsImg from "assets/img/no-results.svg";

function parseNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function applyClientFilters(cars, params) {
  if (!cars || cars.length === 0) return [];

  const priceFrom = parseNumber(params.get("priceFrom"));
  const priceTo = parseNumber(params.get("priceTo"));
  const yearFrom = parseNumber(params.get("yearFrom"));
  const yearTo = parseNumber(params.get("yearTo"));
  const mileageFrom = parseNumber(params.get("mileageFrom"));
  const mileageTo = parseNumber(params.get("mileageTo"));
  const colorParam = params.get("color");
  const fuelTypeParam = params.get("fuelType");
  const producerParam = params.get("producer"); // new producer param

  return cars.filter((c) => {
    if (priceFrom != null && (c.price == null || c.price < priceFrom))
      return false;
    if (priceTo != null && (c.price == null || c.price > priceTo)) return false;

    if (yearFrom != null && (c.year == null || c.year < yearFrom)) return false;
    if (yearTo != null && (c.year == null || c.year > yearTo)) return false;

    if (mileageFrom != null && (c.mileage == null || c.mileage < mileageFrom))
      return false;
    if (mileageTo != null && (c.mileage == null || c.mileage > mileageTo))
      return false;

    if (colorParam && c.color && String(c.color.id) !== String(colorParam))
      return false;
    if (
      fuelTypeParam &&
      c.petrolType &&
      String(c.petrolType.id) !== String(fuelTypeParam)
    )
      return false;

    // Producer filter: your car object uses `producent` in sample data
    if (producerParam) {
      // support either `producent` or `producer` field on car objects
      const prod = c.producent || c.producer || c.producerId || null;
      if (!prod) return false;
      // prod may be object {id,...} or numeric/string id
      const prodId = prod.id !== undefined ? prod.id : prod;
      if (String(prodId) !== String(producerParam)) return false;
    }

    return true;
  });
}

function CarsPage() {
  const [allCars, setAllCars] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const params = useParams();
  const location = useLocation();
  const { carId } = params;

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setIsLoaded(false);
    carService
      .getAll()
      .then((data) => {
        setAllCars(data || []);
        setCurrentPage(1);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(true);
      });
  }, [location.pathname]);

  // compute filtered list in-memory
  const filteredCars = useMemo(() => {
    return applyClientFilters(allCars, searchParams);
  }, [allCars, searchParams]);

  // reset page to 1 whenever search params change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams.toString()]);

  if (error) return <Navigate to="/*" replace />;

  if (!isLoaded) return <Loader />;

  if (carId) return <CarInfoPage carId={carId} />;

  const paginatedCars = paginate(filteredCars, currentPage, pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page);
    setSearchParams(newParams);
  };

  return (
    <div className="cars-page">
      <aside className="filtration-form-aside">
        <FiltrationForm />
      </aside>

      <section
        className={`content${filteredCars.length === 0 ? "-no-results" : ""}`}
      >
        {filteredCars.length === 0 ? (
          <div className="no-results" role="status" aria-live="polite">
            <div className="no-results__wrapper">
              <h3 className="no-results__title">Brak ogłoszeń</h3>
              <img src={noResultsImg} alt="No result were found!" className="no-results-img" />
              <p className="no-results__desc">
                Nie znaleziono samochodów pasujących do wybranych parametrów.
                Spróbuj poszerzyć zakres filtrów lub wyczyść je, aby zobaczyć
                wszystkie ogłoszenia.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="cars-cards">
              {paginatedCars.map((carData) => (
                <CarCard key={carData.id} carInfo={carData} />
              ))}
            </div>

            <Pagination
              itemsCount={filteredCars.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default CarsPage;
