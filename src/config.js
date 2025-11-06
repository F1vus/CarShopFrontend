const dev = {
  apiEndpoint: "http://localhost:8080/api/v1",
};

const prod = {
  apiEndpoint: "https://your-backend-domain.com/api/v1",
};

const config = process.env.NODE_ENV === "development" ? dev : prod;

export default config;
