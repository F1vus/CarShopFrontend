const dev = {
  apiEndpoint: "http://localhost:8080",
};

const prod = {
  apiEndpoint: "https://carshopbackend-production-8c33.up.railway.app",
};

const config = import.meta.env.MODE === "development" ? dev : prod;

export default config;
