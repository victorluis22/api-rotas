import db from "../database/index.js";
import { createPasswordHash } from "../services/auth.js";

class empresaController {
	async create(req, res) {
		const {
			nome, 
            cnpj, 
            endereco, 
            telefone, 
            login, 
            senha
		} = req.body;

		db.query(
			"SELECT * FROM empresacoletadora WHERE CNPJ = ?",
			[cnpj],
			async (err, result) => {
				if (err) {
					return res.status(500).send(err);
				} else if (result.length > 0) {
					return res.status(402).send({ message: "Empresa com CNPJ já cadastrado!" });
				} else {
                    const hashPassword = await createPasswordHash(senha)
					db.query(
						`INSERT INTO empresacoletadora 
                        (Nome, CNPJ, Endereco, Telefone, Login, Senha) 
                        VALUES (?, ?, ?, ?, ?, ?)`,
						[
							nome,
							cnpj, 
                            endereco, 
                            telefone, 
                            login, 
                            hashPassword
						],
						(err) => {
							if (err) {
								return res.status(500).send(err);
							} else {
								return res
									.status(200)
									.send({ message: "Nova empresa cadastrada com sucesso!" });
							}
						}
					);
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT * FROM empresacoletadora", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
			nome, 
            cnpj, 
            endereco, 
            telefone, 
            login, 
            senha
		} = req.body;

		const { id } = req.params;

        const hashPassword = await createPasswordHash(senha)

		db.query(
			`UPDATE empresacoletadora SET Nome=?, CNPJ=?, Endereco=?, Telefone=?, Login=?, Senha=? WHERE CodEmpresa=?`,
			[
				nome,
				cnpj, 
                endereco, 
                telefone, 
                login, 
                hashPassword,
				id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhuma empresa encontrada com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Empresa atualizada com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM empresacoletadora WHERE CodEmpresa=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhuma empresa encontrada com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Empresa excluida com sucesso!" });
			}
		});
	}
}

export default new empresaController();
