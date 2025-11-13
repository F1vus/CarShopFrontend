import { Outlet } from "react-router-dom";
import CurrentLocation from "./CurrentLocation";
import NavBar from "./NavBar";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="app">
      <NavBar />
      <CurrentLocation />
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
