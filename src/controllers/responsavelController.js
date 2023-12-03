import db from "../database/index.js";

class responsavelController {
	async create(req, res) {
		const {
            nome,
            codEmpresa
		} = req.body;

		db.query(
			`INSERT INTO responsavel 
			(Nome, CodEmpresa) 
			VALUES (?, ?)`,
			[
				nome,
				codEmpresa
			],
			(err) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					return res
						.status(200)
						.send({ message: "Novo responsável cadastrado com sucesso!" });
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT CodResp, Nome, CodEmpresa FROM responsavel", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
            nome,
            codEmpresa, 
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE responsavel SET Nome=?, CodEmpresa=? WHERE CodResp=?`,
			[
                nome,
                codEmpresa, 
				id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhum responsável encontrado com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Responsável atualizado com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM responsavel WHERE CodResp=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhum responsável encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Responsável excluido com sucesso!" });
			}
		});
	}
}

export default new responsavelController();
