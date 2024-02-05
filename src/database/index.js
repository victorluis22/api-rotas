import mySQL from 'mysql2'

const db = mySQL.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_HOST_USER,
    password: process.env.MYSQL_HOST_PASSWORD,
    database: process.env.MYSQL_HOST_DATABASE
})

export default db