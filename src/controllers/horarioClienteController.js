import db from "../database/index.js";

class horarioClienteController {
	async create(req, res) {
		const {
            dataIni,
            dataFim,
            volumeBalde,
            codTipoCont,
            codEmpresa,
            codCliente,
            codTipoVeic
		} = req.body;

		db.query(
			`INSERT INTO contrato 
			(DataIni, DataFim, VolumeBalde, CodTipoCont, CodEmpresa, CodCliente, CodTipoVeic) 
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				dataIni,
                dataFim,
                volumeBalde,
                codTipoCont,
                codEmpresa,
                codCliente,
                codTipoVeic
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

	async read(req, res) {
		db.query("SELECT * FROM contrato", (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	}

    async readContratoCliente (req, res){
        const { id } = req.params;
        db.query("SELECT * FROM contrato WHERE CodCliente=?", [id] ,(err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
    }

	async update(req, res) {
		const {
            dataIni,
            dataFim,
            volumeBalde,
            codTipoCont,
            codEmpresa,
            codCliente,
            codTipoVeic
		} = req.body;

		const { id } = req.params;

		db.query(
			`UPDATE contrato SET DataIni=?, DataFim=?, VolumeBalde=?, CodTipoCont=? CodEmpresa=?, CodCliente=?, CodTipoVeic=? WHERE NumContrato=?`,
			[
                dataIni,
                dataFim,
                volumeBalde,
                codTipoCont,
                codEmpresa,
                codCliente,
                codTipoVeic,
				id
			],
			(err, result) => {
				if (err) {
					return res.status(500).send(err);
				}

				if (result.affectedRows === 0) {
					return res.status(404).send({
						message: "Nenhum contrato encontrado com esse id.",
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

		db.query("DELETE FROM contrato WHERE NumContrato=?;", [id], async (err, result) => {
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

export default new horarioClienteController();
