const routes = require("express").Router();

const UserController = require("./app/controllers/UserController");

routes.post("/api/files", UserController.store);

routes.get("/api/users", UserController.search);

module.exports = routes;
