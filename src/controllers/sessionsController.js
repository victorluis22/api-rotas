import Jwt from "jsonwebtoken";
import db from "../database/index.js";
import { checkPassword } from "../services/auth.js";
import authConfig from '../config/auth.js'

class sessionControler{
    async create(req, res){
        const { login, senha } = req.body;

        db.query("SELECT * FROM empresacoletadora WHERE login = ?", [login], async (err, result) => {
            if(err){
                return res.status(500).send(err);
            }

            if(result.length === 0){
                return res.status(401).json({error: "Login inválido"})
            }
            
            if(result.length > 0){
                const company = result[0]

                if(!await checkPassword(company.Senha, senha)){
                    return res.status(401).json({error: "Senha inválida"})
                }

                const { CodEmpresa, Nome, CNPJ } = company

                return res.json({
                    company: {
                        CodEmpresa,
                        Nome,
                        CNPJ
                    },
                    token: Jwt.sign({ CodEmpresa, Nome, CNPJ }, authConfig.secret, {
                        expiresIn: authConfig.expiresIn
                    })
                })
            }
        })
    }
}

export default new sessionControler()