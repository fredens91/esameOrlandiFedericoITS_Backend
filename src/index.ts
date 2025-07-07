import "reflect-metadata";
import app from "./app";
import mongoose from "mongoose";
import { requireEnvVars } from "./utils/dotenv";

const [MONGO_URI, PORT] = requireEnvVars(["MONGO_URI", "PORT"]);

mongoose.set("debug", false);
mongoose
  .connect(MONGO_URI, {})
  .then((_) => {
    console.log("\x1b[92m%s\x1b[0m", "Connected to the online database ✔️");
    app.listen(PORT, () => {
      console.log("\x1b[92m%s\x1b[0m", `Server listening on port ${PORT} ✔️`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });