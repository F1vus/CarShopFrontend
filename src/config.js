const dev = {
  apiEndpoint: "http://localhost:8080/api/v1",
};

const prod = {
  apiEndpoint: "https://carshopbackend-production-8c33.up.railway.app/api/v1",
};

const config = import.meta.env.MODE === "development" ? dev : prod;

export default config;
