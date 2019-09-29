const express = require("express");
const handle = require("express-async-handler");
const routes = express.Router();
const CEPController = require("./app/controllers/CEPController");
const CPFController = require("./app/controllers/CPFController");
const ProdutosController = require("./app/controllers/ProdutosController");
const DialogController = require("./app/controllers/DialogController");

routes.post("/dialog", handle(DialogController.dialog));
routes.get("/categoria/:nome", handle(ProdutosController.categoria));
routes.get("/sugestao", handle(ProdutosController.sugestao));
routes.get("/produto/:nome", handle(ProdutosController.produto));
routes.get("/codigo/:codigo_produto", handle(ProdutosController.codigo));
routes.get("/CEP/:cep", handle(CEPController.pesquisar));
routes.get("/CPF/:cpf", handle(CPFController.validar));
module.exports = routes;
