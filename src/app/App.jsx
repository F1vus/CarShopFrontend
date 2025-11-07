import Footer from "./components/layouts/Footer";
import NavBar from "./components/layouts/NavBar";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./components/page/HomePage";
import AuthorizationPage from "./components/page/AuthorizationPage";
import ContactsPage from "./components/page/ContactsPage";
import NotFoundPage from "./components/page/NotFoundPage";
import ShoppingBasketPage from "./components/page/ShopingBasketPage";
import SellCarPage from "./components/page/SellCarPage";
import CarsPage from "./components/page/CarsPage";
import Layout from "./components/layouts/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace/>} />
          <Route path="/cars/:carId?" element={<CarsPage />} />
          <Route path="/auth" element={<AuthorizationPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/sellcar" element={<SellCarPage />} />
          <Route path="/basket" element={<ShoppingBasketPage />} />
        </Route>
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
