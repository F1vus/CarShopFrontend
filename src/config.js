const dev = {
  apiEndpoint: "http://localhost:8080",
};

const prod = {
  apiEndpoint: "http://localhost:8080",
};

const config = process.env.NODE_ENV === "development" ? dev : prod;

export default config;
