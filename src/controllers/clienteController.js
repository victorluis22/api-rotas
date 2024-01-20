import db from "../database/index.js";
import fs from "fs"
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
					generatePDF(nome, `${logradouro} ${numero} ${complemento}, ${bairro}, ${cidade}, ${uf}`, "randon msg")
					const pdfData = fs.readFileSync('./src/assets/pdf/client.pdf');

					db.query(
						`INSERT INTO cliente 
                        (Nome, Logradouro, Numero, Complemento, CEP, Bairro, Cidade, UF, TempoColeta, CPF_CNPJ, PJ_PF, QRCode) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
							pdfData
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

		generatePDF(nome, `${logradouro} ${numero} ${complemento}, ${bairro}, ${cidade}, ${uf}`, "randon msg")
		const pdfData = fs.readFileSync('./src/assets/pdf/client.pdf', {encoding: 'base64'});

		db.query(
			`UPDATE cliente SET Nome=?, Logradouro=?, Numero=?, Complemento=?, CEP=?, Bairro=?, Cidade=?, UF=?, TempoColeta=?, CPF_CNPJ=?, PJ_PF=?, QRCode=? WHERE CodCliente=?`,
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
				pdfData,
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

	async readQRCodes(req, res){
		db.query("SELECT QRCode FROM cliente", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

	async getQRCode(req, res){
		const { id } = req.params;

		db.query("SELECT QRCode FROM cliente WHERE CodCliente=?;", [id], async (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			if (result.length === 0) {
				return res
					.status(404)
					.send({ message: "Nenhum cliente encontrado com esse id." });
			} else {
				const pdfData = result[0].QRCode;
				console.log(pdfData)
				
				fs.writeFileSync('./src/assets/pdf/retrievedClient.pdf', pdfData);
				
				return res
					.status(200)
					.send({ message: "QRCode recuperado com sucesso!" });
			}
		});
	}
}

export default new clienteController();
