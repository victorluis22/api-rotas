import db from "../database/index.js";

class responsavelVeicController {
	async create(req, res) {
		const {
            codResp,
			codVeic
		} = req.body;

		db.query(
			`
				SELECT * FROM responsavelveiculo
				WHERE CodResp = ? AND CodVeic=?
			`,
			[codResp, codVeic],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.length > 0){
					return res.status(402).send({message: "Responsável de veículo já cadastrado"})
				}

				db.query(
					`INSERT INTO responsavelveiculo
					(CodResp, CodVeic) 
					VALUES (?, ?)`,
					[
						codResp,
						codVeic
					],
					(err) => {
						if (err) {
							return res.status(500).send(err);
						} else {
							return res
								.status(200)
								.send({ message: "Novo responsável de veículo cadastrado com sucesso!" });
						}
					}
				);
			}
		)
	}

	async read(req, res) {
		db.query("SELECT * FROM responsavelveiculo", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

    async readRespVeiculo (req, res){
        const { id } = req.params;
        db.query(`
			SELECT CodRV, RV.CodResp, Nome, CodVeic FROM responsavelveiculo RV
			INNER JOIN responsavel R ON R.CodResp = RV.CodResp
			WHERE CodVeic=?
		`, [id] ,(err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
    }

	async update(req, res) {
		const {
            codResp,
			codVeic
		} = req.body;

		const { id } = req.params;

		db.query(
			`
				SELECT * FROM responsavelveiculo
				WHERE CodResp = ? AND CodVeic=?
			`,
			[codResp, codVeic],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.length > 0){
					return res.status(402).send({message: "Responsável de veículo já cadastrado"})
				}

				db.query(
					`UPDATE responsavelveiculo SET CodResp=?, CodVeic=? WHERE CodRV=?`,
					[
						codResp,
						codVeic,
						id
					],
					(err, result) => {
						if (err) {
							console.log(err)
							return res.status(500).send(err);
						}
		
						if (result.affectedRows === 0) {
							return res.status(404).send({
								message: "Nenhum responsável de veículo encontrado com esse id.",
							});
						}
		
						return res
							.status(200)
							.send({ message: "Responsável de veículo atualizado com sucesso!" });
					}
				);
			}
		)
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM responsavelveiculo WHERE CodRV=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				console.log(result)
				return res
					.status(404)
					.send({ message: "Nenhum responsável de veículo encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Responsável de veículo excluido com sucesso!" });
			}
		});
	}
}

export default new responsavelVeicController();
