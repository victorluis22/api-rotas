import mySQL from 'mysql2'

const db = mySQL.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "rotas"
})

console.log(db ? `${db.config.connectionConfig.database} inicializado com sucesso`: `Falha ao inicializar banco`)

export default db