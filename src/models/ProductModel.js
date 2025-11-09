import pool from '../config/db.js';

export const getProducts = async (page= 1, limit = 10, category_id = 0, search='', price_range = 0) =>{
    const offset = (page - 1) * limit;
    let query = "SELECT * FROM product WHERE 1=1 ";
    const params = [];

    if(category_id > 0){
        query += "AND category_id = ? ";
        params.push(category_id);
    }

    if(search){
        query += "AND name LIKE ? ";
        params.push(`%${search}%`);
    }

    switch(price_range){
        case 1:
            query += "AND price < 500 ";
            break;
        case 2:
            query += "AND price >= 500 AND price <= 1000 ";
            break;
        case 3:
            query += "AND price > 1000";
    }

    query += "LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] =  await pool.query(query, params);
    return rows;
}

export const getProductCount = async (limit = 10, category_id = 0, search='', price_range = 0) =>{
    let query = "SELECT COUNT(*) AS total FROM product WHERE 1=1 ";
    const params = [];

    if(category_id > 0){
        query += "AND category_id = ? ";
        params.push(category_id);
    }

    if(search){
        query += "AND name LIKE ? ";
        params.push(`%${search}%`);
    }

    switch(price_range){
        case 1:
            query += "AND price < 500 ";
            break;
        case 2:
            query += "AND price >= 500 AND price <= 1000 ";
            break;
        case 3:
            query += "AND price > 1000";
    }

    const [[{total}]] = await pool.query(query, params);
    return total;
}

export const getProductById = async(id = -1) =>{
    if(id === -1){
        const error = new Error('Invalid id');
        error.statusCode = 400;
        throw error;
    }

    const [rows] = await pool.query("SELECT * FROM product WHERE id = ?", [id]);
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