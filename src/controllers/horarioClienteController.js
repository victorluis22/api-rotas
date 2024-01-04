import db from "../database/index.js";

class horarioClienteController {
	async create(req, res) {
		const {
            codHorario,
			codContrato
		} = req.body;

		db.query(
			`INSERT INTO horariocoletacliente
			(CodHorario, NumContrato) 
			VALUES (?, ?)`,
			[
				codHorario,
				codContrato
			],
			(err) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					return res
						.status(200)
						.send({ message: "Novo horário de cliente cadastrado com sucesso!" });
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT * FROM horariocoletacliente", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

    async readHorarioContrato (req, res){
        const { id } = req.params;
        db.query(`
			SELECT CodHC, HCC.CodHorario, DiaSemana, HoraIni, HoraFim, NumContrato FROM horariocoletacliente HCC
			INNER JOIN horario H ON H.CodHorario = HCC.CodHorario
			INNER JOIN janelatempo JT ON JT.CodTurno = H.CodTurno
			WHERE NumContrato=?
		`, [id] ,(err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
    }

	async update(req, res) {
		const {
            codHorario,
			codContrato
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE horariocoletacliente SET CodHorario=?, NumContrato=? WHERE CodHC=?`,
			[
                codHorario,
				codContrato,
				id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhum horário de cliente encontrado com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Horário de cliente atualizado com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM horariocoletacliente WHERE CodHC=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				console.log(result)
				return res
					.status(404)
					.send({ message: "Nenhum horário de cliente encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Horário de cliente excluido com sucesso!" });
			}
		});
	}
}

export default new horarioClienteController();
