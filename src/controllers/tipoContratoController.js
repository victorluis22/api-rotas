import db from "../database/index.js";

class tipoContratoController {
	async create(req, res) {
		const {
            periodicidade,
            valorMensal
		} = req.body;

		db.query(
			`INSERT INTO tipocontrato 
			(Periodicidade, ValorMensal) 
			VALUES (?, ?)`,
			[
				periodicidade,
				valorMensal
			],
			(err) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					return res
						.status(200)
						.send({ message: "Novo contrato cadastrado com sucesso!" });
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT * FROM tipocontrato", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
            periodicidade,
            valorMensal
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE tipocontrato SET Periodicidade=?, ValorMensal=? WHERE CodTipoContrato=?`,
			[
                periodicidade,
                valorMensal,
                id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhum tipo de contrato encontrado com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Tipo de contrato atualizado com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM tipocontrato WHERE CodTipoContrato=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhum tipo de contrato encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Tipo de contrato excluido com sucesso!" });
			}
		});
	}
}

export default new tipoContratoController();
