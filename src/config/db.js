import mysql from "mysql2/promise.js";

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});


const connect = async () =>{
    return await pool.getConnection();
}

export default connect;