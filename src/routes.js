import { Router } from "express";

import auth from "./middleWares/auth.js";

import sessionsController from "./controllers/sessionsController.js";
import clienteController from "./controllers/clienteController.js";
import empresaController from "./controllers/empresaController.js";

const routes = Router();

const test = async (req, res) => {
    return res.status(200).json({message: "Ola mundo"})
}

//Rotas livres
routes.get("/", test)
routes.post("/login", sessionsController.create);
routes.post("/clientes", clienteController.create);

// Middleware de autenticação
// routes.use(auth)

// Rotas Protegidas

// Cliente Routes
routes.get("/clientes", clienteController.read);
routes.put('/cliente/:id', clienteController.update);
routes.delete("/cliente/:id", clienteController.delete);
routes.get("/clientes/qrcodes", clienteController.readQRCodes);
routes.get("/clientes/qrcode/:id", clienteController.getQRCode);

// Empresa Routes
routes.post("/empresas", empresaController.create)
routes.get("/empresas", empresaController.read);
routes.put('/empresa/:id', empresaController.update);
routes.delete("/empresa/:id", empresaController.delete);


export default routes;
