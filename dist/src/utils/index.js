"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const crypto_1 = __importDefault(require("crypto"));
const streamifier_1 = __importDefault(require("streamifier"));
const cloudnairy_1 = __importDefault(require("../../config/cloudnairy"));
const uuid_1 = require("uuid");
class Utils {
    constructor() {
        this.generateOtp = () => {
            return Array.from({ length: 6 }, () => crypto_1.default.randomInt(0, 10)).join("");
        };
        this.generateTransactionId = () => {
            const prefix = "SD";
            const timestamp = Date.now().toString(36);
            const randomPart = crypto_1.default.randomBytes(4).toString("hex");
            return `${prefix}-${timestamp}-${randomPart}`.toUpperCase();
        };
        this.uploadFromBuffer = (fileBuffer, folder) => {
            return new Promise((resolve, reject) => {
                const stream = cloudnairy_1.default.uploader.upload_stream({ folder, public_id: (0, uuid_1.v4)() }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                streamifier_1.default.createReadStream(fileBuffer).pipe(stream);
            });
        };
    }
    wrapAsync(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }
    customResponse({ res, status, message, description, data, }) {
        return res.status(status).json({
            message,
            description,
            data,
        });
    }
}
exports.utils = new Utils();
