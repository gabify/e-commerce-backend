import pool from '../config/db.js';

export const getProducts = async () =>{
    const[rows] = await pool.query("SELECT * FROM product");
    return rows;
}

export const insertProduct = async (product) =>{
    const [result] = await pool.query("INSERT INTO product(name, description, price, stock_quantity, category_id, thumbnail) VALUES(?,?,?,?,?,?)",
        [product.name, product.description, product.price, product.stock_quantity, product.category_id, product.thumbnail]
    );

    return result.insertId;

    return 
}