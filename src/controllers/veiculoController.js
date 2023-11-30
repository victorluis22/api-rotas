import db from "../database/index.js";

class veiculoController {
	async create(req, res) {
		const {
			descricao, 
			emissao, 
			custo,
			capacidadeMax,
			codTipo,
			codEmpresa
		} = req.body;

		db.query(
			`INSERT INTO veiculo 
			(Descricao, EmissaoPorKm, CustoPorKm, CapacMax, CodTipoVeic, CodEmpresa) 
			VALUES (?, ?, ?, ?, ?, ?)`,
			[
				descricao, 
				emissao, 
				custo,
				capacidadeMax,
				codTipo,
				codEmpresa
			],
			(err) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					return res
						.status(200)
						.send({ message: "Novo veículo cadastrado com sucesso!" });
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT * FROM veiculo", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
			descricao, 
			emissao, 
			custo,
			capacidadeMax,
			codTipo,
			codEmpresa
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE veiculo SET Descricao=?, EmissaoPorKm=?, CustoPorKm=?, CapacMax=?, CodTipoVeic=?, CodEmpresa=? WHERE CodVeic=?`,
			[
				descricao, 
				emissao, 
				custo,
				capacidadeMax,
				codTipo,
				codEmpresa,
				id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhum veículo encontrado com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Veículo atualizado com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM veiculo WHERE CodVeic=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhum veículo encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Veículo excluído com sucesso!" });
			}
		});
	}
}

export default new veiculoController();
