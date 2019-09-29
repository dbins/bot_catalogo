"use strict";
const { createLogger, format, transports } = require("winston");
const appRoot = require("app-root-path");
require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");
const clfDate = require("clf-date");

const env = process.env.NODE_ENV || "development";
const logDir = `${appRoot}/logs`; //Caminho a partir da raiz!

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${appRoot}/logs/%DATE%-results.log`,
  datePattern: "YYYY-MM-DD"
});

let formatLabel = "label";
if (process.mainModule) {
  formatLabel = path.basename(process.mainModule.filename);
}
const logger = createLogger({
  // change level if in dev environment versus production
  level: env === "development" ? "verbose" : "info",
  format: format.combine(
    format.label({ label: formatLabel }),
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.printf(
      // We display the label text between square brackets using ${info.label} on the next line
      info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
    )
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    new transports.File({
      level: "error",
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    dailyRotateFileTransport
  ]
});

// create a stream object with a 'write' function that will be used by `morgan`. This stream is based on node.js stream https://nodejs.org/api/stream.html.
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports
    logger.info(message);
  }
};

logger.combinedFormat = function(err, req, res) {
  // Similar combined format in morgan
  // :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
  return `${req.ip} - - [${clfDate(new Date())}] \"${req.method} ${
    req.originalUrl
  } HTTP/${req.httpVersion}\" ${err.status || 500} - ${
    req.headers["user-agent"]
  }`;
};
module.exports = logger;
