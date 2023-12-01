import db from "../database/index.js";
import fs from "fs"

class responsavelController {
	async create(req, res) {
		const {
			codResp,
            Nome,
            CodEmpresa
		} = req.body;

		db.query(
			"SELECT * FROM responsavel WHERE codResp = ?",
			[codResp],
			async (err, result) => {
				if (err) {
					return res.status(500).send(err);
				} else if (result.length > 0) {
					return res.status(402).send({ message: "Responsável já cadastrado!" });
				} else {

					db.query(
						`INSERT INTO responsavel 
                        (codResp, Nome, CodEmpresa) 
                        VALUES (?, ?, ?)`,
						[
							codResp,
                            Nome,
                            CodEmpresa
						],
						(err) => {
							if (err) {
								return res.status(500).send(err);
							} else {
								return res
									.status(200)
									.send({ message: "Novo resposável cadastrado com sucesso!" });
							}
						}
					);
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT codResp, Nome, CodEmpresa FROM responsavel", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
			codResp,
            Nome,
            CodEmpresa, 
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE responsavel SET codResp=?, Nome=?, CodEmpresa=? WHERE codResp=?`,
			[
				codResp,
                Nome,
                CodEmpresa, 
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

		db.query("DELETE FROM responsável WHERE codResp=?;", [id], async (err, result) => {
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
