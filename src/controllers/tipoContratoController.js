import db from "../database/index.js";

class codTipoContController {
	async create(req, res) {
		const {
			codTipoCont,
            periodicidade,
            valorMensal
		} = req.body;

		db.query(
			"SELECT * FROM codTipoCont WHERE codTipoCont = ?",
			[codTipoCont],
			async (err, result) => {
				if (err) {
					return res.status(500).send(err);
				} else if (result.length > 0) {
					return res.status(402).send({ message: "Empresa com CNPJ já cadastrado!" });
				} else {
            
					db.query(
						`INSERT INTO codTipoCont 
                        (CodTipoContrato, Periodicidade, ValorMensal) 
                        VALUES (?, ?, ?)`,
						[
							codTipoCont,
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
			}
		);
	}

	async read(req, res) {
		db.query("SELECT * FROM codTipoCont", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
			codTipoCont,
            periodicidade,
            valorMensal
		} = req.body;

		const { id } = req.params;


		db.query(
			`UPDATE codTipoCont SET codTipoCont=?, Periodicidade=?, ValorMensal=?`,
			[
				codTipoCont,
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
						message: "Nenhuma contrato encontrado com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Contrato atualizado com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM codTipoCont WHERE codTipoCont=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhum contrato encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Contrato excluido com sucesso!" });
			}
		});
	}
}

export default new codTipoContController();
