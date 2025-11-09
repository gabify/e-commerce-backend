import pool from "../config/db.js";

export const getCategory = async() =>{
    const [rows] = await pool.query("SELECT * FROM category");
    return rows;
}

export const insertCategory = async(name, description) =>{
    if(name === '' || name.length > 255){
        const error = new Error('Invalid value');
        error.statusCode = 400;
        throw error;
    }

    if(description === '' || description.length > 255){
        const error = new Error('Invalid value');
        error.statusCode = 400;
        throw error;
    }

    const [result] =await  pool.query(
        "INSERT INTO category(category_name, category_desc) VALUES(?,?)",
        [name, description]
    );

    return result.insertId;
}