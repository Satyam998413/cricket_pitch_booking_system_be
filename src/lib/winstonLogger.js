const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const transport1 = new DailyRotateFile({
  filename: `logs/errors/%DATE%.log`,
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "15d",
});

const transport2 = new DailyRotateFile({
  filename: `logs/http/%DATE%.log`,
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "40m",
  maxFiles: "7d",
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [transport1],
});

const loggerHttp = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [transport2],
});

const httpLogger = (req, res, next) => {
  const start = Date.now(); // Start time of request
  console.log("-----------Enter Logger-----", req.url,req.body,req.query);
  res.on("finish", () => {
    // Fires when response is sent
    const duration = Date.now() - start; // Calculate execution time
    loggerHttp.info(
      `API Requested: ${req.method} ${req.url} | Status: ${
        res.statusCode
      } |user:${JSON.stringify(req.user || {})}|query:${JSON.stringify(
        res.query || {}
      )}|body:${JSON.stringify(req.body || {})}| Execution Time: ${duration}ms`
    );
  });
  next();
};

const writeLog = (funcName, message, level = "error", stack = null) => {
  if (level == "error") {
    logger.log({
      level: level,
      funcName: funcName,
      message: message,
      stack: stack,
      LocalDateNTime: new Date().toLocaleString(),
    });
  } else {
    logger.log({
      level: level,
      funcName: funcName,
      message: message.toString(),
      LocalDateNTime: new Date().toLocaleString(),
    });
  }
};

module.exports = { writeLog, httpLogger };
