import db from "../database/index.js";
import { getClientsAvailability, mergeAvailabilitySameClient } from "../services/json.js";

class jsonController {
	async createClientJSON(req, res) {
		db.query(
			`   
        SELECT
        C.CodCliente as id,
        C.Nome as name, 
        C.PJ_PF as cathegory,
        TC.Periodicidade as plan,
        C.Bairro as district,
        C.Logradouro as address,
        C.Numero as number,
        C.Complemento as complement,
        H.DiaSemana as day,
        JT.HoraIni as initialHour,
        JT.HoraFim as endHour,
        C.TempoColeta as duration,
        TV.DescTipo as vehicle
        
        FROM cliente C
        INNER JOIN contrato CT ON CT.CodCliente = C.CodCliente
        INNER JOIN tipocontrato TC ON TC.CodTipoContrato = CT.CodTipoContrato
        INNER JOIN tipoveiculo TV ON TV.CodTipoVeic = CT.CodTipoVeic
        INNER JOIN horariocoletacliente HCC ON HCC.NumContrato = CT.NumContrato
        INNER JOIN horario H ON H.CodHorario = HCC.CodHorario
        INNER JOIN janelatempo JT ON JT.CodTurno = H.CodTurno
        ORDER BY C.Nome  
      `,
			async (err, result) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          
          const clientsData = getClientsAvailability(result)
          const mergedClients = mergeAvailabilitySameClient(clientsData);

          return res.status(200).send(mergedClients);
        }
      }
    );
  }
}
export default new jsonController()



