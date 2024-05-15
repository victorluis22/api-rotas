import db from "../database/index.js";

class horarioVeiculoController {
	async create(req, res) {
		const {
            codHorario,
			codVeic
		} = req.body;

		db.query(
			`
				SELECT * FROM horariodisponveiculo
				WHERE CodHorario = ? AND CodVeic=?
			`,
			[codHorario, codVeic],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.length > 0){
					return res.status(402).send({message: "Horário já cadastrado"})
				}
				db.query(
					`INSERT INTO horariodisponveiculo
					(CodHorario, CodVeic) 
					VALUES (?, ?)`,
					[
						codHorario,
						codVeic
					],
					(err) => {
						if (err) {
							return res.status(500).send(err);
						} else {
							return res
								.status(200)
								.send({ message: "Novo horário de veículo cadastrado com sucesso!" });
						}
					}
				);
				
			}
		)		
	}

	async read(req, res) {
		db.query("SELECT * FROM horariodisponveiculo", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

    async readHorarioVeiculo (req, res){
        const { id } = req.params;
        db.query(`
			SELECT CodDV, HDV.CodHorario, DiaSemana, HoraIni, HoraFim, CodVeic FROM horariodisponveiculo HDV
			INNER JOIN horario H ON H.CodHorario = HDV.CodHorario
			INNER JOIN janelatempo JT ON JT.CodTurno = H.CodTurno
			WHERE CodVeic=?
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
			codVeic
		} = req.body;

		const { id } = req.params;

		db.query(
			`
				SELECT * FROM horariodisponveiculo
				WHERE CodHorario = ? AND CodVeic=?
			`,
			[codHorario, codVeic],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.length > 0){
					return res.status(402).send({message: "Horário já cadastrado"})
				}
				
				
				db.query(
					`UPDATE horariodisponveiculo SET CodHorario=?, CodVeic=? WHERE CodDV=?`,
					[
						codHorario,
						codVeic,
						id
					],
					(err, result) => {
						if (err) {
							console.log(err)
							return res.status(500).send(err);
						}
		
						if (result.affectedRows === 0) {
							return res.status(404).send({
								message: "Nenhum horário de veículo encontrado com esse id.",
							});
						}
		
						return res
							.status(200)
							.send({ message: "Horário de veículo atualizado com sucesso!" });
					}
				);
			}
		)
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM horariodisponveiculo WHERE CodDV=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				console.log(result)
				return res
					.status(404)
					.send({ message: "Nenhum horário de veículo encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Horário de veículo excluido com sucesso!" });
			}
		});
	}
}

export default new horarioVeiculoController();
