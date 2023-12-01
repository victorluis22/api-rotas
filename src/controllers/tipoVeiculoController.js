import db from "../database/index.js";

class tipoVeiculoController {
	async create(req, res) {
		const {
			codTipoVeic,
            descrTipo
		} = req.body;

		db.query(
			`INSERT INTO tipoVeiculo 
			(codTipoVeic, DescrTipo) 
			VALUES (?, ?)`,
			[
				codTipoVeic,
                descrTipo
			],
			(err) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					return res
						.status(200)
						.send({ message: "Novo tipo de veículo cadastrado com sucesso!" });
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT * FROM tipoVeiculo", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
			codTipoVeic,
            descrTipo
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE tipoVeiculo SET codTipoVeic=?, descrTipo=?WHERE codTipoVeic=?`,
			[
				codTipoVeic,
                descrTipo,
				id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhum tipo de veículo encontrado com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Tipo de veículo atualizado com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM tipoVeiculo WHERE codTipoVeic=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhum tipo veículo encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Tipo de veículo excluído com sucesso!" });
			}
		});
	}
}

export default new tipoVeiculoController();
