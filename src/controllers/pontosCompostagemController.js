import db from "../database/index.js";

class pontosCompostagemController {
	async create(req, res) {
		const {
            codPonto,
            descricao,
            logradouro,
            numero,
            complemento,
            utm,
            bairro,
            cidade,
            uf,
            capacMaxDia,
            codEmpresa
		} = req.body;

		db.query(
			`INSERT INTO pontosCompostagem
            (   codPonto,
                descricao,
                logradouro,
                numero,
                complemento,
                utm,
                bairro,
                cidade,
                uf,
                capacMaxDia,
                codEmpresa)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
                codPonto,
                descricao,
                logradouro,
                numero,
                complemento,
                utm,
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
		db.query("SELECT * FROM pontosCompostagem", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
            codPonto,
            descricao,
            logradouro,
            numero,
            complemento,
            utm,
            bairro,
            cidade,
            uf,
            capacMaxDia,
            codEmpresa
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE pontosCompostagem SET codPonto=?, descricao=?, logradouro=?, numero=?, complemento=?, utm=?, bairro=?, cidade=?, uf=?, capacMaxDia=?, codEmpresa=?  WHERE codPonto=?`,
			[   codPonto,
                descricao,
                logradouro,
                numero,
                complemento,
                utm,
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

		db.query("DELETE FROM pontosCompostagem WHERE codPonto=?;", [id], async (err, result) => {
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
