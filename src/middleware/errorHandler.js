import { writeLog } from "../../lib/winstonLogger.js";

export const errorHandler = (err, req, res, next) => {
    console.log(err);
    let status = err.statusCode || 500;
    if (err.message) {
        status = err.message.includes('too large') ? 200 : 500
    }
    writeLog("errorHandler", err.message, "error", err.stack)
    
    return res.status(status).json({
        success: false,
        message: err.message,
        stack: err.stack
    })
}