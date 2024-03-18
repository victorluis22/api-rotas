import db from "../database/index.js";

class pontosCompostagemController {
	async create(req, res) {
		const {
            descricao,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            capacMaxDia,
            codEmpresa
		} = req.body;

		db.query(
			`INSERT INTO pontocompostagem
            (
                descricao,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                capacMaxDia,
                codEmpresa)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
                descricao,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                capacMaxDia,
                codEmpresa
			],
			(err) => {
				if (err) {
					return res.status(500).send(err);
				} else {
					return res
						.status(200)
						.send({ message: "Novo Ponto de Compostagem cadastrado com sucesso!" });
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT * FROM pontocompostagem", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
            descricao,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            capacMaxDia,
            codEmpresa
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE pontocompostagem SET descricao=?, logradouro=?, numero=?, complemento=?, bairro=?, cidade=?, uf=?, capacMaxDia=?, codEmpresa=?  WHERE codPonto=?`,
			[  
                descricao,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                capacMaxDia,
                codEmpresa,
				id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhum Ponto de Compostagem encontrado com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Ponto de Compostagem atualizado com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM pontocompostagem WHERE CodPonto=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhum Ponto de Compostagem encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Ponto de Compostagem excluído com sucesso!" });
			}
		});
	}
}

export default new pontosCompostagemController();
