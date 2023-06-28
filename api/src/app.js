require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
});

var bodyParser = require('body-parser');

const express = require("express");
const cors = require("cors");

class AppController {
  constructor() {
    this.express = express();
    this.express.use(express.json());
    this.express.use(cors());

    this.express.use(bodyParser.json({ limit: '50mb', extended: true }))
    this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

    this.routes();
  }

  routes() {
    this.express.use(require("./routes"));
  }
}

module.exports = new AppController().express;
