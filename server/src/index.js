import "dotenv/config";
import express from "express";
import cors from "cors";
import applicationsRouter from "./routes/applications.js";
import paymentsRouter from "./routes/payments.js";

const app = express();

//? Only our React app is allowed to call this API.
app.use(cors({ origin: process.env.CLIENT_URL }));

//? Read JSON sent in request bodies
app.use(express.json());

app.use("/api/applications", applicationsRouter);

//? Fake payments exist only outside production
if (process.env.NODE_ENV !== "production") {
  app.use("/api/payments", paymentsRouter);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});