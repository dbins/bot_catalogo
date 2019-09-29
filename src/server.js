const express = require("express");
var morgan = require("morgan");
const logger = require("./logger");
const cors = require("cors");

class App {
  constructor() {
    this.express = express();
    this.isDev = process.env.NODE_ENV;
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.express.use(express.urlencoded({ extended: false })); // Para receber dados de formularios
    this.express.use(express.json());
    this.express.use(cors());
    this.express.use(morgan("combined", { stream: logger.stream }));
  }

  routes() {
    this.express.use(require("./routes"));
    this.express.use(function(req, res, next) {
      next(new Error("Não encontrado"));
    });

    this.express.use(function(err, req, res, next) {
      logger.error(logger.combinedFormat(err, req, res));
      logger.error(err);
      res.status(err.status || 500).send(err);
    });
  }
}

module.exports = new App().express;
