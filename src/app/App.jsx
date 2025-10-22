import { useState, useEffect } from "react";
import api from "./api";
import Footer from "./components/layouts/Footer";
import NavBar from "./components/layouts/NavBar";

function App() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    api.cars.getAllCars().then((response) => setCars(response));
  }, []);

  //TODO Add routings
  return (
    <>
      <NavBar />
      <main className="main">
        <div className="container">
          {cars.map((car) => (
            <div className="card" key={car.id}>
              <h2>{car.name}</h2>
              <p>{car.description}</p>
              <p>Price: {car.price}</p>
              <p>Color: {car.color}</p>
              <div className="photos">
                {car.photos.map((photo, idx) => (
                  <img key={idx} src={photo} alt={car.name} width={"150px"} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
