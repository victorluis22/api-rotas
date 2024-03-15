import db from "../database/index.js";

import { createJSON, saveJSONBucket } from "../services/json.js";

class jsonController {
	async createClientJSON(req, res) {

    const saveBucket = req.query.save_bucket

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
        ORDER BY C.CodCliente  
      `,
			async (err, result) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          
          const json = createJSON(result, "cliente")

          if (saveBucket){
            var filename = 'customers_data.json';
            await saveJSONBucket(filename, json)

            return res.status(200).send({sucess: `${filename} salvo com sucesso no bucket ${process.env.GOOGLE_BUCKET_NAME}`})
          }

          return res.status(200).send(json);
        }
      }
    );
  }

  async createVeicJSON(req, res) {
    const saveBucket = req.query.save_bucket

    db.query(`
      SELECT
      V.CodVeic as id,
      V.Descricao as description,
      V.CapacMax as capacity,
      V.CustoMensal as monthly_cost,
      V.CustoPorKm as km_driven_cost,
      V.EmissaoPorKm as km_driven_emission,
      H.DiaSemana as day,
      JT.HoraIni as initialHour,
      JT.HoraFim as endHour
      
      FROM veiculo V
      INNER JOIN tipoveiculo TV ON TV.CodTipoVeic = V.CodTipoVeic
      INNER JOIN horariodisponveiculo HDV ON HDV.CodVeic = V.CodVeic
      INNER JOIN horario H ON H.CodHorario = HDV.CodHorario
      INNER JOIN janelatempo JT ON JT.CodTurno = H.CodTurno
      ORDER BY V.CodVeic
    `,
    async (err, result) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        const json = createJSON(result, "veiculo")

        if (saveBucket){
          var filename = 'vehicles_data.json';

          await saveJSONBucket(filename, json)
          return res.status(200).send({sucess: `${filename} salvo com sucesso no bucket ${process.env.GOOGLE_BUCKET_NAME}`})
        }

        return res.status(200).send(json);
      }
    }
    );
  }

  async createPointJSON(req, res){
    const saveBucket = req.query.save_bucket
    
    db.query(`
      SELECT
      PC.CodPonto as id,
      PC.Descricao as name,
      PC.Bairro as district,
      PC.Logradouro as address,
      PC.Numero as number,
      PC.Complemento as complement,
      H.DiaSemana as day,
      JT.HoraIni as initialHour,
      JT.HoraFim as endHour

      FROM pontocompostagem PC
      INNER JOIN horadescartepontocomp HDP ON HDP.CodPonto = PC.CodPonto
      INNER JOIN horario H ON H.CodHorario = HDP.CodHorario
      INNER JOIN janelatempo JT ON JT.CodTurno = H.CodTurno
      ORDER BY PC.CodPonto
    `,
    async (err, result) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        
        const json = createJSON(result, "pontoCompostagem")

        if (saveBucket){
          var filename = 'depots_data.json';

          await saveJSONBucket(filename, json)
          return res.status(200).send({sucess: `${filename} salvo com sucesso no bucket ${process.env.GOOGLE_BUCKET_NAME}`})
        }

        return res.status(200).send(json);
      }
    });
  }
}
export default new jsonController()


