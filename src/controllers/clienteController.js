import db from "../database/index.js";
import { generatePDF } from "../services/pdf.js";

class clienteController {
	async create(req, res) {
		const {
			nome,
			logradouro,
			numero,
			complemento,
			cep,
			bairro,
			cidade,
			uf,
			tempoColeta,
			cpfcnpj,
			pjpf
		} = req.body;

		db.query(
			"SELECT * FROM cliente WHERE CPF_CNPJ = ?",
			[cpfcnpj],
			async (err, result) => {
				if (err) {
					return res.status(500).send(err);
				} else if (result.length > 0) {
					return res.status(402).send({ message: "Cliente com CPF ou CNPJ já cadastrado!" });
				} else {
					db.query(
						`INSERT INTO cliente 
                        (Nome, Logradouro, Numero, Complemento, CEP, Bairro, Cidade, UF, TempoColeta, CPF_CNPJ, PJ_PF) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
						[
							nome,
							logradouro,
							numero,
							complemento,
							cep,
							bairro,
							cidade,
							uf,
							tempoColeta,
							cpfcnpj,
							pjpf
						],
						(err) => {
							if (err) {
								return res.status(500).send(err);
							} else {

								return res
									.status(200)
									.send({ message: "Novo cliente cadastrado com sucesso!" });
							}
						}
					);
				}
			}
		);
	}

	async read(req, res) {
		db.query("SELECT CodCliente, Nome, Logradouro, Numero, Complemento, CEP, Bairro, Cidade, UF, TempoColeta, CPF_CNPJ, PJ_PF FROM cliente", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async update(req, res) {
		const {
			nome,
			logradouro,
			numero,
			complemento,
			cep,
			bairro,
			cidade,
			uf,
			tempoColeta,
			cpfcnpj,
			pjpf
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE cliente SET Nome=?, Logradouro=?, Numero=?, Complemento=?, CEP=?, Bairro=?, Cidade=?, UF=?, TempoColeta=?, CPF_CNPJ=?, PJ_PF=? WHERE CodCliente=?`,
			[
				nome,
				logradouro,
				numero,
				complemento,
				cep,
				bairro,
				cidade,
				uf,
				tempoColeta,
				cpfcnpj,
				pjpf,
				id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhum cliente encontrado com esse id.",
					});
				}

				return res
					.status(200)
					.send({ message: "Cliente atualizado com sucesso!" });
			}
		);
	}

	async delete(req, res) {
		const { id } = req.params;

		db.query("DELETE FROM cliente WHERE CodCliente=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.affectedRows === 0) {
				return res
					.status(404)
					.send({ message: "Nenhum cliente encontrado com esse id." });
			} else {
				return res
					.status(200)
					.send({ message: "Cliente excluido com sucesso!" });
			}
		});
	}

	async generateQRCode(req, res) {
		const { id } = req.params;

		db.query(
			"SELECT * FROM cliente WHERE CodCliente = ?",
			[id],
			async (err, result) => {
				if (err) {
					return res.status(500).send(err);
				} else if (result.length == 0) {
					return res.status(404).send({ message: "Cliente não encontrado!" });
				} else {
					const data = result[0]
					const name = data.Nome
					const address = `${data.Logradouro} ${data.Numero} ${data.Complemento}, ${data.Bairro}, ${data.Cidade}, ${data.UF}`
					const id = data.CodCliente
					
					generatePDF(name, address, id, (pdfData) => {
						return res.status(200).send({ pdfData })
					});
				}
			}
		);
	}
}

export default new clienteController();
