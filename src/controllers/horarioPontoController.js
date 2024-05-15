import db from "../database/index.js";

class horarioPontoController {
	async create(req, res) {
		const {
            codHorario,
			codPonto
		} = req.body;

		db.query(
			`
				SELECT * FROM horadescartepontocomp
				WHERE CodHorario = ? AND CodPonto=?
			`,
			[codHorario, codPonto],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.length > 0){
					return res.status(402).send({message: "Horário já cadastrado"})
				}

				db.query(
					`INSERT INTO horadescartepontocomp
					(CodHorario, CodPonto) 
					VALUES (?, ?)`,
					[
						codHorario,
						codPonto
					],
					(err) => {
						if (err) {
							return res.status(500).send(err);
						} else {
							return res
								.status(200)
								.send({ message: "Novo horário de ponto de compostagem cadastrado com sucesso!" });
						}
					}
				);

			}
		)
	}

	async read(req, res) {
		db.query("SELECT * FROM horadescartepontocomp", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

    async readHorarioPonto (req, res){
        const { id } = req.params;
        db.query(`
			SELECT CodHD, HDPC.CodHorario, DiaSemana, HoraIni, HoraFim, CodPonto FROM horadescartepontocomp HDPC
			INNER JOIN horario H ON H.CodHorario = HDPC.CodHorario
			INNER JOIN janelatempo JT ON JT.CodTurno = H.CodTurno
			WHERE CodPonto=?
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
			codPonto
		} = req.body;

		const { id } = req.params;

		db.query(
			`
				SELECT * FROM horadescartepontocomp
				WHERE CodHorario = ? AND CodPonto=?
			`,
			[codHorario, codPonto],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.length > 0){
					return res.status(402).send({message: "Horário já cadastrado"})
				}

				db.query(
					`UPDATE horadescartepontocomp SET CodHorario=?, CodPonto=? WHERE CodHD=?`,
					[
						codHorario,
						codPonto,
						id
					],
					(err, result) => {
						if (err) {
							console.log(err)
							return res.status(500).send(err);
						}
		
						if (result.affectedRows === 0) {
							return res.status(404).send({
								message: "Nenhum horário de ponto de compostagem encontrado com esse id.",
							});
						}
		
						return res
							.status(200)
							.send({ message: "Horário de ponto de compostagem atualizado com sucesso!" });
					}
				);
			}
		)
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM horadescartepontocomp WHERE CodHD=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				console.log(result)
				return res
					.status(404)
					.send({ message: "Nenhum horário de ponto de compostagem encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Horário de ponto de compostagem excluido com sucesso!" });
			}
		});
	}
}

export default new horarioPontoController();
