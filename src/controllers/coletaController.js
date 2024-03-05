import db from "../database/index.js";

class coletaController {
	async create(req, res) {
		const {
            pesoColetado,
            codCliente
		} = req.body;

		db.query(
			`INSERT INTO coletarealizada
			(DataHora, PesoColetado, CodCliente) 
			VALUES (NOW(), ?, ?);
            `,
			[
                pesoColetado,
                codCliente
			],
			(err, result) => {
				if (err) {
					console.log(err)
					return res.status(500).send(err);
				} else {
					return res
						.status(200)
						.send({message: "Coleta realizada com sucesso", insertId: result.insertId});
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT * FROM coletarealizada", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
            pesoColetado,
            codCliente
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE coletarealizada SET DataHora=NOW(), PesoColetado=?, CodCliente=? WHERE CodColeta=?`,
			[
                pesoColetado,
                codCliente,
				id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhuma coleta encontrada com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Coleta atualizada com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM coletarealizada WHERE CodColeta=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhuma coleta encontrada com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Coleta excluída com sucesso!" });
			}
		});
	}
}

export default new coletaController();
