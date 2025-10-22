// import axios from "axios";
// import config from "@/config.json";

// export async function getAllCars() {
//   const request = {
//     method: "GET",
//     baseURL: config.apiEndpoint,
//     path: "/cars",
//     allowAbsoluteUrls: true,
//   };

//   try {
//     const response = await axios.request(request);
//     return response;
//   } catch (e) {
//     // TODO: Add better error handling
//     console.error(e);
//   }
// }

// export async function getCarById(id) {
//   const request = {
//     method: "GET",
//     baseURL: `${config.apiEndpoint}`,
//     url: `/cars`,
//     allowAbsoluteUrls: true,
//     params: {
//       id: id,
//     },
//   };

//   try {
//     const response = await axios.request(request);
//     return response;
//   } catch (e) {
//     // TODO: Add better error handling
//     console.error(e);
//   }
// }

const cars = [
  {
    id: 1,
    name: "Golf",
    mark: "Volkswagen",
    price: 45000,
    description: "Fajny samochód",
    color: "Gray",
    mileage: 120000,
    auto_status: "Used",
    petrol_type: "Hybrid",
    engine_capacity: 1600,
    power: 110,
    photos: ["https://614now.com/wp-content/uploads/2023/09/IMG_0963.jpeg"],
  },
  {
    id: 2,
    name: "Model 3",
    mark: "Tesla",
    price: 60000,
    description: "Nowoczesny i elektryczny",
    color: "Red",
    mileage: 20000,
    auto_status: "Used",
    petrol_type: "Electric",
    engine_capacity: 0,
    power: 283,
    photos: [
      "https://www.milivolt.pl/wp-content/uploads/2020/02/Tesla_Model_3-102x.jpg",
    ],
  },
  {
    id: 3,
    name: "Civic",
    mark: "Honda",
    price: 30000,
    description: "Ekonomiczny i niezawodny",
    color: "Blue",
    mileage: 90000,
    auto_status: "Used",
    petrol_type: "Petrol",
    engine_capacity: 1800,
    power: 140,
    photos: [
      "https://cdn.motor1.com/images/mgl/oV3mE/s1/2020-honda-civic-type-r.jpg",
    ],
  },
  {
    id: 4,
    name: "A4",
    mark: "Audi",
    price: 55000,
    description: "Luksusowy sedan z mocnym silnikiem",
    color: "Black",
    mileage: 75000,
    auto_status: "Used",
    petrol_type: "Diesel",
    engine_capacity: 2000,
    power: 190,
    photos: [
      "https://image.ceneostatic.pl/data/products/147491545/i-audi-a4-b8-facelift-2-0-tdi-136-km-ultra.jpg",
    ],
  },
  {
    id: 5,
    name: "Corolla",
    mark: "Toyota",
    price: 28000,
    description: "Idealny samochód do miasta",
    color: "White",
    mileage: 30000,
    auto_status: "Used",
    petrol_type: "Hybrid",
    engine_capacity: 1800,
    power: 122,
    photos: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF-kTPM5njS6chMx3E97wuyaL8BD1lB9aFcw&s",
    ],
  },
];

// add this data locally
if (!localStorage.getItem("cars")) {
  localStorage.setItem("cars", JSON.stringify(cars));
}

const getAllCars = () => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(JSON.parse(localStorage.getItem("cars")));
    });
  });
};

const getCarById = (id) => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(
        JSON.parse(localStorage.getItem("cars")).find((car) => car.id === id)
      );
    });
  });
};

export default {
  getAllCars,
  getCarById,
};
