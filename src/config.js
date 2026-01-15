const dev = {
  apiEndpoint: "http://localhost:8080",
  photosEndpoint: "http://localhost:8000",
};

const prod = {
  apiEndpoint: "http://localhost:8080",
  photosEndpoint: "http://localhost:8000",
};

const config = process.env.NODE_ENV === "development" ? dev : prod;

export default config;
