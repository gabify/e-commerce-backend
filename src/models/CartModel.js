import { getProductById } from "./ProductModel.js";
import { doesUserExist } from "./UserModel.js";
import generateException from "../utils/exceptionGenerator.js";

const getCartByProductAndUser = async (productId= -1, userId = -1, conn) =>{
    const pId =  Number(productId);
    const uId = Number(userId);
    
    if(!Number.isInteger(pId) || pId < 1){
        generateException('TypeError', 'Invalid product id.', 400);
    }

    if(!Number.isInteger(uId) || uId < 1){
        generateException('TypeError', 'Invalid user id.', 400);
    }

    const [item] = await conn.query('SELECT * FROM cart WHERE product_id = ? AND user_id = ?', [pId, uId]);

    return item.length > 0 ? item[0] : null;
}

export const getCartItems = async(id = -1, conn) =>{
    const userId = Number(id);
    if(!Number.isInteger(userId) || userId < 1){
        generateException('TypeError', 'Invalid user id.', 400);
    }

    await doesUserExist(userId, conn);

    const [items] = await conn.query(
        `SELECT cart.id AS cart_id, 
        cart.product_id,
        cart.quantity,
        product.name,
        product.price,
        product.thumbnail,
        product.stock_quantity
        FROM cart 
        JOIN product ON product.id = cart.product_id 
        WHERE cart.user_id = ?`, 
    [userId]);

    return items;
}

export const addItemToCart = async(productId, userId, quantity, conn) =>{
    productId = parseInt(productId);
    userId = parseInt(userId);
    quantity = parseInt(quantity);

    //check if productId, userId and quantity is valid
    if(isNaN(productId) || isNaN(userId) || isNaN(quantity)){
        generateException('TypeError', 'Incomplete details. Please complete the details before adding items to cart.', 400);
    }

    //check if product exist
    const product = await getProductById(productId, conn);
    if(!product){
        generateException('Error', 'Product not found', 404);
    }

    //check if product has enough stock
    if(quantity < 1 || quantity > product.stock_quantity){
        generateException('Error', 'Insufficient stock.', 400);
    }

    //check if user exist
    await doesUserExist(userId, conn);

    //check if product already exist in the user cart
    const cartItem = await getCartByProductAndUser(productId, userId, conn);

    if(cartItem){

        //check if total quantity does not exceed the stock
        if((cartItem.quantity + quantity) > product.stock_quantity){
            generateException('Error', 'Insufficient stock', 400);
        }

        //Add quantiy if product exist in the cart
        await conn.query("UPDATE cart SET quantity = quantity + ? WHERE product_id = ? AND user_id = ?", 
            [quantity, productId, userId]);

    }else{
        //Add new product to cart
        await conn.query("INSERT INTO cart(user_id, product_id, quantity) VALUES(?,?,?)", 
        [userId, productId, quantity])
    }

    return await getCartItems(userId, conn);


}

export const updateCartItem = async(userId = -1, cartId = -1, quantity = -1, conn) =>{
    const uId = parseInt(userId);
    const cId = parseInt(cartId);
    const q = parseInt(quantity);

    if(!Number.isInteger(uId) || uId < 1){
        generateException('TypeError', 'Invalid user id.', 400);
    }

    if(!Number.isInteger(cId) || cId < 1){
        generateException('TypeError', 'Invalid cart id.', 400);
    }

    if(!Number.isInteger(q) || q < 1){
        generateException('TypeError', 'Invalid quantity.', 400);
    }

    await doesUserExist(uId, conn);

    const [item] = await conn.query("SELECT * FROM cart WHERE id = ? AND user_id = ?", [cId, uId]);
    
    if(item.length === 0){
        generateException('Error', 'Cart item not found.', 404);
    }

    const product = await getProductById(item[0].product_id, conn);

    if(!product){
        generateException('Error', 'Product not found', 404);
    }

    if(q > product.stock_quantity){
        generateException('Error', 'Insufficient stock', 400);
    }

    await conn.query("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ? ", [q, cId, uId]);

    return getCartItems(uId);
}

export const deleteCartItem = async(userId, cartId, conn) =>{
    const uId = parseInt(userId);
    const cId = parseInt(cartId);

    if(!Number.isInteger(uId) || uId < 1){
        generateException('TypeError', 'Invalid user id.', 400);
    }

    if(!Number.isInteger(cId) || cId < 1){
        generateException('TypeError', 'Invalid cart id.', 400);
    }
    
    await doesUserExist(uId, conn);

    const [item] = await conn.query("SELECT * FROM cart WHERE id = ? AND user_id = ?", [cId, uId]);
    
    if(item.length === 0){
        generateException('Error', 'Cart item not found.', 404);
    }

    await conn.query("DELETE FROM cart WHERE id = ? AND user_id = ?", [cId, uId]);

    return getCartItems(uId, conn);
}

export const validateCartItems = async (cart = [], conn) =>{
    if(cart.length === 0){
        generateException('Error', 'Cart items not found', 404);
    }

    const validatedCartItem = await Promise.all(
        cart.map(async(item) =>{
            const product = await getProductById(item.product_id, conn);
            if(!product) generateException('Error', 'Product not found', 404);
            if(product.stock_quantity < item.quantity) generateException('Error', 'Insufficient stock', 400);

            return {...item, product}
        })
    )

    return validatedCartItem;
}

export const clearCart = async(userId = -1, conn) =>{
    const uId = parseInt(userId);

    if(!Number.isInteger(uId) || uId < 1){
        generateException('TypeError', 'Invalid user id.', 400);
    }

    doesUserExist(uId, conn);

    const [result] = await conn.query("DELETE FROM cart WHERE user_id = ?", [uId]);

    return result.affectedRows ? true : false;
}
