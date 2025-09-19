import express, { NextFunction, Request, Response, Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server as HttpServer } from "http";

import Logging from "./src/utils/loggin";
import { MessageResponse } from "./src/utils/enum";
import { AuthRouter } from "./src/auth/router";
import { UserRouter } from "./src/user/router";
import { TransactionRouter } from "./src/transaction/router";
const app: Express = express();

dotenv.config();

const port = 8080;

const StartServer = () => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    Logging.info(
      `Incoming ==> Method : [${req.method}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      // Log the Response
      Logging.info(
        `Incomming ==> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - status: [${res.statusCode}]`
      );
    });

    next();
  });

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  // Cors
  app.use(
    cors({
      origin: "*",
      // [
      //   "https://kingswaycompany.com",
      //   "https://kingways-logistics.vercel.app",
      //   "http://127.0.0.1:5500",
      // ],
      credentials: true,
    })
  );
  const basePath = "/api/v1";
  // Auth Routes
  app.use(`${basePath}/auth`, AuthRouter);
  // User Routes
  app.use(basePath, UserRouter);
  // Tx Routes
  app.use(`${basePath}/transaction`, TransactionRouter);

  // Health check
  app.get("/api/v1/healthcheck", (_req: Request, res: Response) => {
    res.status(200).json({ status: "UP 🔥🔧🎂" });
  });

  // Invalid url error handling
  app.use((_req: Request, res: Response) => {
    const _error = new Error("Url not found 😟");

    Logging.error(_error);

    return res.status(404).json({ message: _error.message });
  });

  //error middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err) {
      console.error(err);

      res.status(500).json({
        message: MessageResponse.Error,
        description: "Internal Server Error",
        data: null,
      });
    }
  });

  const server: HttpServer = app.listen(port, () =>
    Logging.info(`Server is running on port ${port} 🔥🔧`)
  );
};

const MONGODB_URI = process.env.MONGODB_URI || "";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    Logging.info(`Database connected 🎂`);

    StartServer();
  })
  .catch((_error) => {
    Logging.error("Error while connecting to Database ===> ");

    Logging.error(_error);

    process.exit(1);
  });
