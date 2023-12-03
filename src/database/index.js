import mySQL from 'mysql2'

const db = mySQL.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "rotas"
})

export default db