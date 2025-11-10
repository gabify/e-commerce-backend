import pool from "../config/db.js";

export const getCategory = async(page = 1, limit = 10, search = '') =>{
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM category WHERE 1=1 ";
    const params = [];

    if(search){
        query += "AND category_name LIKE ? ";
        params.push(`%${search}%`);
    }

    query += "LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
}

export const getCategoryCount = async (search='') =>{
    let query = "SELECT COUNT(*) AS total FROM category WHERE 1=1 ";
    const params = [];

    if(search){
        query += "AND name LIKE ? ";
        params.push(`%${search}%`);
    }

    const [[{total}]] = await pool.query(query, params);
    return total;
}

export const getCategoryById = async (id = -1) =>{
    if(id === -1 || id == NaN){
        const error = new Error('Invalid id');
        error.statusCode = 400;
        throw error;
    }

    const [rows] = await pool.query("SELECT * FROM category WHERE id = ?", [id]);
    return rows[0];
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