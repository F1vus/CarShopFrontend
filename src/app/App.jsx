import { useState, useEffect } from "react";
import api from "./api";
import Footer from "./components/layouts/Footer";
import NavBar from "./components/layouts/NavBar";

function App() {
  const [cars, setCars] = useState([]);

  useEffect( () => {
      async function fetchData(){
          await api.cars.getAllCars()
              .then((response) => {
                  console.log(response)
                  setCars([...response.data])
              });
      }
      fetchData()
      console.log(cars)
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
                  <p>State: {car.state}</p>
                  <p>Year: {car.year}</p>
                  <div className="photos">
                      <img src={car.imageUrl} alt={car.name} width={"150px"}/>
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
