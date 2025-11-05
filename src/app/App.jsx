import { useState, useEffect } from "react";
import api from "./api";
import Footer from "./components/layouts/Footer";
import NavBar from "./components/layouts/NavBar";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./components/page/HomePage";
import AuthorizationPage from "./components/page/AuthorizationPage";
import ContactsPage from "./components/page/ContactsPage";
import NotFoundPage from "./components/page/NotFoundPage";
import ShoppingBasketPage from "./components/page/ShopingBasketPage";
import SellCarPage from "./components/page/SellCarPage";

function App() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await api.cars.getAllCars().then((response) => {
        console.log(response);
        setCars([...response.data]);
      });
    }
    fetchData();
    console.log(cars);
  }, []);

  return (
    <>
      <NavBar />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/auth" element={<AuthorizationPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/basket" element={<ShoppingBasketPage />} />
            <Route path="/sellcar" element={<SellCarPage />} />
            <Route path="/*" element={<NotFoundPage />} />
           
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
