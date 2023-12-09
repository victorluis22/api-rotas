import db from "../database/index.js";

class horariosController {
	async create(req, res) {
		const {
            diaSemana,
            codTurno
		} = req.body;

		db.query(
			`INSERT INTO horario 
			(
                DiaSemana,
                CodTurno) 
			VALUES (?, ?)`,
			[
                diaSemana,
                codTurno
			],
			(err) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					return res
						.status(200)
						.send({ message: "Novo horario cadastrado com sucesso!" });
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT * FROM horario", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
            diaSemana,
            codTurno
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE horario SET DiaSemana=?, CodTurno=? WHERE CodHorario=?`,
			[
                diaSemana,
                codTurno,
                id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhum horario encontrado com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Horario atualizado com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM horario WHERE CodHorario=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhum horario encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Horario excluido com sucesso!" });
			}
		});
	}
}

export default new horariosController();
