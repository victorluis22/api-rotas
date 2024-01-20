const sql = `
SELECT
  id AS "id",
  name AS "name",
  cathegory AS "cathegory",
  plan AS "plan",
  district AS "district",
  address AS "address",
  number AS "number",
  complement AS "complement",
  JSON_ARRAYAGG(
    JSON_OBJECT(
      "day", day,
      "shifts", JSON_ARRAYAGG(shift)
    )
  ) AS "availability",
  duration AS "duration",
  vehicle AS "vehicle"
FROM
  customers
GROUP BY
  id
`;

// const connection = new sql.Connection({
//   database: "my_database",
//   user: "my_user",
//   password: "my_password",
// });

// connection.connect();

// const results = connection.query(sql);

// connection.close();

// const json = results.map((result) => ({
//   id: result.id,
//   name: result.name,
//   cathegory: result.cathegory,
//   plan: result.plan,
//   district: result.district,
//   address: result.address,
//   number: result.number,
//   complement: result.complement,
//   availability: {
//     for(const day of result.availability) {
//       day.shifts = day.shifts.map((shift) => shift.shift);
//     }
//   },
//   duration: result.duration,
//   vehicle: result.vehicle,
// }));

// console.log(json);

import db from "../database/index.js";

class jsonController {
	async create(req, res) {
		db.query(
			`   SELECT 
                C.Nome as name, 
                C.PJ_PF as cathegory,
                TC.Periodicidade as plan,
                C.Bairro as district,
                C.Logradouro as address,
                C.Numero as number,
                C.Complemento as complement,
                C.TempoColeta as duration,
                TV.DescTipo as vehicle
                
                FROM cliente C
                INNER JOIN contrato CT ON CT.CodCliente = C.CodCliente
                INNER JOIN tipocontrato TC ON TC.CodTipoContrato = CT.CodTipoContrato
                INNER JOIN tipoveiculo TV ON TV.CodTipoVeic = CT.CodTipoVeic
            `,
			async (err, result) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					res.status(200)
					res.send({ message: "JSON criado com sucesso!" });
				}
			}
		);
	}
}

export default new jsonController();

