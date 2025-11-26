
//fetch operation
export const getProducts = async (page= 1, limit = 10, category_id = 0, search='', price_range = 0, conn) =>{
    const offset = (page - 1) * limit;
    let query = "SELECT * FROM product WHERE is_active = 1 ";
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

    const [rows] =  await conn.query(query, params);
    return rows;
}

export const getProductCount = async (category_id = 0, search='', price_range = 0, conn) =>{
    let query = "SELECT COUNT(*) AS total FROM product WHERE is_active = 1 ";
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

    const [[{total}]] = await conn.query(query, params);
    return total;
}

export const getProductById = async(id = -1, conn) =>{
    if(id === -1 || id == NaN){
        const error = new Error('Invalid id');
        error.statusCode = 400;
        throw error;
    }

    const [rows] = await conn.query("SELECT * FROM product WHERE id = ?", [id]);
    return rows[0];
}

//Insert operation

export const insertProduct = async (product, conn) =>{
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

    const [result] = await conn.query("INSERT INTO product(name, description, price, stock_quantity, category_id, thumbnail) VALUES(?,?,?,?,?,?)",
        [product.name, product.description, product.price, product.stock_quantity, product.category_id, product.thumbnail]
    );

    return result.insertId;
}

//Update operation

export const updateProduct = async (newProduct = {}, id= -1, conn) =>{
    if(id === -1 || Number.isNaN(id)){
        const error = new Error('Invalid id');
        error.statusCode = 400;
        throw error;
    }

    //check if product exist
    const product = await getProductById(id, conn);
    if(!product){
        const error = new Error(`No product found with id: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    const fields = [];
    const values = [];

    const allowedFields = ["name", "description", "price", "stock_quantity", "category_id", "thumbnail"];

    for(const key of allowedFields){
        if(newProduct[key] !== undefined){
            fields.push(`${key} = ?`);
            values.push(newProduct[key]);
        }
    }

    if(fields.length === 0){
        const error = new Error("No valid fields to update.");
        error.statusCode = 400;
        throw error;
    }

    const query = `UPDATE product SET ${fields.join(", ")} WHERE id = ?`
    values.push(id);

    const [result] = await conn.query(query, values);
    return result.affectedRows;
}


//Delete operation

export const deleteProduct = async (id, conn) =>{
    if(id === -1 || id == NaN){
        const error = new Error('Invalid id');
        error.statusCode = 400;
        throw error;
    }

    //check if product exist
    const product = await getProductById(id, conn);
    if(!product){
        const error = new Error(`No product found with id: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    const [result] = await conn.query("UPDATE product SET is_active = 0 WHERE id = ?", [id]);
    return result.affectedRows;
}