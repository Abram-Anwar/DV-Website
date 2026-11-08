import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import applicationsRouter from "./routes/applications.js";
import paymentsRouter from "./routes/payments.js";
import adminRouter from "./routes/admin.js";

const app = express();

//? Only our React app is allowed to call this API (and may send cookies).
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

//? Read JSON sent in request bodies
app.use(express.json());

//? Read cookies (the admin login token lives in one)
app.use(cookieParser());

app.use("/api/applications", applicationsRouter);
app.use("/api/admin", adminRouter);

//? Fake payments exist only outside production
if (process.env.NODE_ENV !== "production") {
  app.use("/api/payments", paymentsRouter);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});