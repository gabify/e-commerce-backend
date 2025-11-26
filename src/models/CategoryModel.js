import { getProductCount } from "./ProductModel.js";


//Fetch queries
export const getCategory = async(page = 1, limit = 10, search = '', conn) =>{
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM category WHERE is_active = 1 ";
    const params = [];

    if(search){
        query += "AND category_name LIKE ? ";
        params.push(`%${search}%`);
    }

    query += "LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await conn.query(query, params);
    return rows;
}

export const getCategoryCount = async (search='', conn) =>{
    let query = "SELECT COUNT(*) AS total FROM category WHERE is_active = 1 ";
    const params = [];

    if(search){
        query += "AND name LIKE ? ";
        params.push(`%${search}%`);
    }

    const [[{total}]] = await conn.query(query, params);
    return total;
}

export const getCategoryById = async (id = -1, conn) =>{
    if(id === -1 || id == NaN){
        const error = new Error('Invalid id');
        error.statusCode = 400;
        throw error;
    }

    const [rows] = await conn.query("SELECT * FROM category WHERE id = ?", [id]);
    return rows[0];
}

//Insert queries
export const insertCategory = async(name, description, conn) =>{
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

    const [result] = await conn.query(
        "INSERT INTO category(category_name, category_desc) VALUES(?,?)",
        [name, description]
    );

    return result.insertId;
}

//Update queries
export const updateCategory = async(name= '', description= '', id= -1, conn) =>{
    if(id === -1 || id == NaN){
        const error = new Error('Invalid id');
        error.statusCode = 400;
        throw error;
    }   

     //check if category exist
    const category = await getCategoryById(id);
    if(!category){
        const error = new Error(`No category found with id: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    let new_name = name || category.category_name;
    let new_desc = description || category.category_desc;
    

    const [result] = await conn.query("UPDATE category SET category_name = ?, category_desc = ? WHERE id = ?", [new_name, new_desc, id]);
    return result.affectedRows;
}

//Delete queries
export const updateAsInactive = async (id = -1, conn) =>{
    if(id === -1 || id == NaN){
        const error = new Error('Invalid id');
        error.statusCode = 400;
        throw error;
    }

    //check if category exist
    const category = await getCategoryById(id, conn);
    if(!category){
        const error = new Error(`No category found with id: ${id}`);
        error.statusCode = 404;
        throw error;
    }

    //check if a certain products are associated with the category
    const products = await getProductCount(id, conn) || 0;
    if(products > 0){
        const error = new Error(`Unable to delete the category with id: ${id}. There are still products associated with this category.`);
        error.statusCode = 500;
        throw error;
    }

    const [result] = await conn.query("UPDATE category SET is_active = 0 WHERE id = ?", [id]);
    return result.affectedRows;
}