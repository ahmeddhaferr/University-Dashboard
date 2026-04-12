import express, { Router } from "express";

const app = express();
const port = 3000;

app.use(express.json());

const cars = [
  { id: 1, make: "toyota", year: "2015", price: 18000 },
  { id: 2, make: "ford", year: "2020", price: 22000 },
  { id: 3, make: "honda", year: "2025", price: 28000 },
];

const router = express.Router();

app.get("/", (req, res) => {
  res.send("hello from api");
});
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find((car) => car.id === id);

  if (!car) return res.status(404).send("car not found");

  res.json(car);
});

router.get("/", (req, res) => {
  res.json(cars);
});

router.post("/", (req, res) => {
  const { make, year, price } = req.body;
  if (!make || !year || !price) {
    return res.status(400).json({Error:"missing"});
  }

  const newCar = {
    id: cars.length + 1 ,
     make: make ,
     year: Number(year) ,
     price: Number(price) ,
};

  cars.push(newCar);
  res.status(201).json(newCar);
});

router.put("/:id", (req, res) => {
  res.send("update car");
});

router.delete("/:id", (req, res) => {
  res.send("delete car");
});

app.use("/api/v1/cars", router);

app.listen(port, () =>
  console.log(`server is running on http://localhost:${port}`),
);
