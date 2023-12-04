import db from "../database/index.js";

class janelaTempoController {
	async create(req, res) {
		const {
            horaIni,
            horaFim
		} = req.body;

		db.query(
			`INSERT INTO janelatempo
            (HoraIni,
            HoraFim)
			VALUES (?, ?)`,
			[
                horaIni,
                horaFim
			],
			(err) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					return res
						.status(200)
						.send({ message: "Novo Horário/Turno cadastrado com sucesso!" });
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT * FROM janelatempo", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
            horaIni,
            horaFim
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE janelatempo SET HoraIni=? HoraFim=? WHERE CodTurno=?`,
			[
                horaIni,
                horaFim,
				id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhum Horário/Turno encontrado com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Horário/Turno atualizado com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM janelatempo WHERE CodTurno=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhum Horário/Turno encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Horário/Turno excluído com sucesso!" });
			}
		});
	}
}

export default new janelaTempoController();
