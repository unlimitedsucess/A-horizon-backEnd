"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const loggin_1 = __importDefault(require("./src/utils/loggin"));
const enum_1 = require("./src/utils/enum");
const router_1 = require("./src/auth/router");
const router_2 = require("./src/user/router");
const router_3 = require("./src/transaction/router");
const router_4 = require("./src/loan/router");
const router_5 = require("./src/card/router");
const router_6 = require("./src/admin/router");
const router_7 = require("./src/contactUs/router");
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = 8080;
const StartServer = () => {
    app.use((req, res, next) => {
        loggin_1.default.info(`Incoming ==> Method : [${req.method}] - IP: [${req.socket.remoteAddress}]`);
        res.on("finish", () => {
            // Log the Response
            loggin_1.default.info(`Incomming ==> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - status: [${res.statusCode}]`);
        });
        next();
    });
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Cors
    app.use((0, cors_1.default)({
        origin: [
            "http://localhost:3000",
            "https://american-digital-bank.vercel.app",
            "https://american-digital-bank.vercel.app/",
            "https://www.american-digital-bank.vercel.app",
            "https://www.americanhorizon247.com/",
            "https://americanhorizon247.com/"
        ],
        credentials: true,
    }));
    const basePath = "/api/v1";
    // Auth Routes
    app.use(`${basePath}/auth`, router_1.AuthRouter);
    // User Routes
    app.use(basePath, router_2.UserRouter);
    // Tx Routes
    app.use(`${basePath}/transaction`, router_3.TransactionRouter);
    // Loan Routes
    app.use(`${basePath}/loan`, router_4.LoanRouter);
    // Card Routes
    app.use(`${basePath}/card`, router_5.CardRouter);
    // Admin Routes
    app.use(`${basePath}/admin`, router_6.AdminRouter);
    // Contact Routes
    app.use(basePath, router_7.ContactUsRouter);
    // Health check
    app.get("/api/v1/healthcheck", (_req, res) => {
        res.status(200).json({ status: "UP 🔥🔧🎂" });
    });
    // Invalid url error handling
    app.use((_req, res) => {
        const _error = new Error("Url not found 😟");
        loggin_1.default.error(_error);
        return res.status(404).json({ message: _error.message });
    });
    //error middleware
    app.use((err, _req, res, _next) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                message: enum_1.MessageResponse.Error,
                description: "Internal Server Error",
                data: null,
            });
        }
    });
    const server = app.listen(port, () => loggin_1.default.info(`Server is running on port ${port} 🔥🔧`));
};
const MONGODB_URI = process.env.MONGODB_URI || "";
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    loggin_1.default.info(`Database connected 🎂`);
    StartServer();
})
    .catch((_error) => {
    loggin_1.default.error("Error while connecting to Database ===> ");
    loggin_1.default.error(_error);
    process.exit(1);
});
// cron.schedule("*/5 * * * * *", () => {
// console.log("calledd");
// utils.updateLoansAndBalances()
// });
