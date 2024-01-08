import { Router } from "express";

import auth from "./middleWares/auth.js";

import sessionsController from "./controllers/sessionsController.js";
import clienteController from "./controllers/clienteController.js";
import empresaController from "./controllers/empresaController.js";
import veiculoController from "./controllers/veiculoController.js";
import responsavelController from "./controllers/responsavelController.js";
import tipoVeiculoController from "./controllers/tipoVeiculoController.js";
import tipoContratoController from "./controllers/tipoContratoController.js";
import janelaTempoController from "./controllers/janelaTempoController.js";
import horariosController from "./controllers/horariosController.js";
import pontosCompostagemController from "./controllers/pontosCompostagemController.js";
import contratoController from "./controllers/contratoController.js";
import horarioClienteController from "./controllers/horarioClienteController.js";
import horarioPontoController from "./controllers/horarioPontoController.js";

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
routes.put('/clientes/:id', clienteController.update);
routes.delete("/clientes/:id", clienteController.delete);
routes.get("/clientes/qrcodes", clienteController.readQRCodes);
routes.get("/clientes/qrcode/:id", clienteController.getQRCode);

// Empresa Routes
routes.post("/empresas", empresaController.create)
routes.get("/empresas", empresaController.read);
routes.put('/empresas/:id', empresaController.update);
routes.delete("/empresas/:id", empresaController.delete);

// Veiculo Routes
routes.post("/veiculos", veiculoController.create)
routes.get("/veiculos", veiculoController.read);
routes.put('/veiculos/:id', veiculoController.update);
routes.delete("/veiculos/:id", veiculoController.delete);

// Responsável
routes.post("/responsaveis", responsavelController.create)
routes.get("/responsaveis", responsavelController.read);
routes.put("/responsaveis/:id", responsavelController.update);
routes.delete("/responsaveis/:id", responsavelController.delete);

// TipoVeiculo
routes.post("/tipoVeiculo", tipoVeiculoController.create)
routes.get("/tipoVeiculo", tipoVeiculoController.read);
routes.put("/tipoVeiculo/:id", tipoVeiculoController.update);
routes.delete("/tipoVeiculo/:id", tipoVeiculoController.delete);

// TipoContrato
routes.post("/tipoContrato", tipoContratoController.create)
routes.get("/tipoContrato", tipoContratoController.read);
routes.put("/tipoContrato/:id", tipoContratoController.update);
routes.delete("/tipoContrato/:id", tipoContratoController.delete);

//JanelaTempo
routes.post("/janelaTempo", janelaTempoController.create)
routes.get("/janelaTempo", janelaTempoController.read);
routes.put("/janelaTempo/:id", janelaTempoController.update);
routes.delete("/janelaTempo/:id", janelaTempoController.delete);

//Horarios
routes.post("/horarios", horariosController.create)
routes.get("/horarios", horariosController.read);
routes.get("/horarios/all", horariosController.readAll);
routes.put("/horarios/:id", horariosController.update);
routes.delete("/horarios/:id", horariosController.delete);

//Pontos de Compostagem
routes.post("/pontosCompostagem", pontosCompostagemController.create)
routes.get("/pontosCompostagem", pontosCompostagemController.read);
routes.put("/pontosCompostagem/:id", pontosCompostagemController.update);
routes.delete("/pontosCompostagem/:id", pontosCompostagemController.delete);

// Contrato
routes.post("/contrato", contratoController.create)
routes.get("/contrato", contratoController.read);
routes.get("/contrato/:id", contratoController.readClientContract);
routes.put("/contrato/:id", contratoController.update);
routes.delete("/contrato/:id", contratoController.delete);

// Horário Contrato Cliente
routes.post("/horarioContratoCliente", horarioClienteController.create)
routes.get("/horarioContratoCliente", horarioClienteController.read);
routes.get("/horarioContratoCliente/:id", horarioClienteController.readHorarioContrato);
routes.put("/horarioContratoCliente/:id", horarioClienteController.update);
routes.delete("/horarioContratoCliente/:id", horarioClienteController.delete);

// Horário Ponto
routes.post("/horarioPonto", horarioPontoController.create)
routes.get("/horarioPonto", horarioPontoController.read);
routes.get("/horarioPonto/:id", horarioPontoController.readHorarioPonto);
routes.put("/horarioPonto/:id", horarioPontoController.update);
routes.delete("/horarioPonto/:id", horarioPontoController.delete);

export default routes;
