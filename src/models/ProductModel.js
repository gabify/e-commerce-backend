import pool from '../config/db.js';

export const getProducts = async () =>{
    const[rows] = await pool.query("SELECT * FROM product");
    return rows;
}

export const insertProduct = async (product) =>{
    if(product.name == ''){
        const error = new Error('Invalid value');
        error.statusCode = 400;
        throw error;
    }

    const price = parseFloat(product.price);
    if(isNaN(price) || price < 0){
        const error = new Error('Invalid value');
        error.statusCode = 400;
        throw error;
    }

    const stock = parseInt(product.stock_quantity);
    if(isNaN(stock) || product.stock_quantity < 0){
        const error = new Error('Invalid value');
        error.statusCode = 400;
        throw error;
    }

    const [result] = await pool.query("INSERT INTO product(name, description, price, stock_quantity, category_id, thumbnail) VALUES(?,?,?,?,?,?)",
        [product.name, product.description, product.price, product.stock_quantity, product.category_id, product.thumbnail]
    );

    return result.insertId;
}