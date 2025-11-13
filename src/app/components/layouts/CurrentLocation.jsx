import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "styles/_current-location.scss";

function CurrentLocation() {
  const location = useLocation();
  const { carId } = useParams();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const crumbs = [];

    if (pathnames.length > 0) {
      crumbs.push({ name: "Strona główna", path: "/" });
    }

    if (pathnames[0] === "cars") {
      crumbs.push({ name: "Samochody", path: "/cars" });

      if (carId) {
        crumbs.push({ name: "Samochód osobowy", path: `/cars/${carId}` });
      }
    }

    if (pathnames[0] === "contacts") {
      crumbs.push({ name: "Kontakt", path: "/contacts" });
    }

    if (pathnames[0] === "sellcar") {
      crumbs.push({ name: "Sprzedaj samochód", path: "/sellcar" });
    }

    if (pathnames[0] === "basket") {
      crumbs.push({ name: "Koszyk", path: "/basket" });
    }

    if (pathnames[0] === "auth") {
      crumbs.push({ name: "Logowanie / Rejestracja", path: "/auth" });
    }

    setBreadcrumbs(crumbs);
  }, [location, carId]);

  if (location.pathname === "/") return null;

  return (
    <nav className="current-location">
      <div className="container">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link to={crumb.path}>{crumb.name}</Link>
                <span className="separator"> - </span>
              </>
            ) : (
              <span className="current">{crumb.name}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}

export default CurrentLocation;
