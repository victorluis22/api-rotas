import db from "../database/index.js";

class tipoVeiculoController {
	async create(req, res) {
		const {
			codTipoVeic,
            descTipo
		} = req.body;
		db.query(
			"SELECT * FROM tipoveiculo WHERE DescTipo = ?",
			[descTipo],
			async (err, result) => {
				if (err) {
					return res.status(500).send(err);
				} else if (result.length > 0) {
					return res.status(402).send({ message: "Tipo já cadastrado!" });
				} else {
					db.query(
						`INSERT INTO tipoveiculo 
						(CodTipoVeic, DescTipo) 
						VALUES (?, ?)`,
						[
							codTipoVeic,
							descTipo
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
			}
		);
		
	}

	async read(req, res) {
		db.query("SELECT * FROM tipoveiculo", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
			codTipoVeic,
            descTipo
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE tipoveiculo SET CodTipoVeic=?, DescTipo=? WHERE CodTipoVeic=?`,
			[
				codTipoVeic,
                descTipo,
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

		db.query("DELETE FROM tipoveiculo WHERE CodTipoVeic=?;", [id], async (err, result) => {
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
