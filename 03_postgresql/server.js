import express from "express";
import { db } from "./db.js";
import { cars } from "./schema.js";
import { eq } from "drizzle-orm";

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello from Car API!");
});

router.get("/cars", async(req, res) => {
  const allCars = await db.select().from(cars);
res.json(allCars); 
});

router.post("/cars", async (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).json({
      error: "Please provide make, model, year, and price",
    });
  }

  const [newCar] = await db
    .insert(cars)
    .values({
      make,
      model,
      year,
      price,
    })
    .returning();

  res.status(201).json(newCar);
});

router.put("/cars/:id", async (req, res) => {
  const carId = Number(req.params.id);
  const { make, model, year, price } = req.body;

  try {
    const updatedCar = await db
      .update(cars)
      .set({
        make,
        model,
        year,
        price,
      })
      .where(eq(cars.id, carId))
      .returning(); 

    if (updatedCar.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({
      message: "Car updated successfully",
      car: updatedCar[0],
    });

  } catch (err) {
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
});

router.delete("/cars/:id", async (req, res) => {
  const carId = parseInt(req.params.id);

  try {
    const deleted = await db
      .delete(cars)
      .where(eq(cars.id, carId))
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({
      message: "Car deleted successfully",
      car: deleted[0],
    });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
});

router.get("/cars/:id", async (req, res) => {
  const carId = parseInt(req.params.id);

  try {
    const car = await db
      .select()
      .from(cars)
      .where(eq(cars.id, carId));

    if (car.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car[0]);
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong!",
      message: err.message,
    });
  }
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
