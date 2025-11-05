import pool from '../config/db.js';

export const getProducts = async () =>{
    const[rows] = await pool.query("SELECT * FROM product");
    return rows;
}