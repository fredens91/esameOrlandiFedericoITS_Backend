import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./api/routes";
import bodyParser from "body-parser";
import { errorHandlers } from "./errors";
import "./utils/auth/auth-handlers";

const app = express();

// app.use(cors({
//   origin: [
//   'http://localhost:4200',
//   'https://esameorlandifedericoits-frontend.onrender.com'
// ],
//   credentials: true,
// }));

app.use(morgan("tiny"));
app.use(bodyParser.json());

app.use("/api", apiRouter);

// Api for delete all collections in db
app.delete(
  "/api/clear",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all([
      ]);
      res.status(200).send("All collections cleared");
    } catch (error) {
      res.status(500).send("Error clearing collections");
    }
  }
);

app.use(errorHandlers);
export default app;
