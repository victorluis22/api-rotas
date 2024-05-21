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

	async getXLSXData(req, res){
		const { empresaId } = req.params;

		db.query(
			`
				SELECT C.*, TC.Periodicidade, TC.ValorMensal, CT.DataIni, CT.DataFim, CT.VolumeBalde, EC.Nome AS Empresa, H.DiaSemana, JT.HoraIni, JT.HoraFim, TP.DescTipo AS "Tipo Veiculo"  FROM cliente C
				INNER JOIN contrato CT ON CT.CodCliente = C.CodCliente
				INNER JOIN horariocoletacliente HCC ON HCC.NumContrato = CT.NumContrato
				INNER JOIN tipocontrato TC ON TC.CodTipoContrato = CT.CodTipoContrato
				INNER JOIN empresacoletadora EC ON EC.CodEmpresa = CT.CodEmpresa
				INNER JOIN horario H ON H.CodHorario = HCC.CodHorario
				INNER JOIN janelatempo JT ON JT.CodTurno = H.CodTurno
				INNER JOIN tipoveiculo TP ON TP.CodTipoVeic = CT.CodTipoVeic
				WHERE CT.CodEmpresa = ?
				ORDER BY C.CodCliente
			`,
			[empresaId],
			async (err, result) => {
				if (err) {
					return res.status(500).send(err);
				} else if (result.length == 0) {
					return res.status(404).send({ message: "Clientes não encontrados." });
				} else {
					return res.status(200).send(result);
				}
			}
		);
	}
}

export default new clienteController();
