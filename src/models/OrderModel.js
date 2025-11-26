import { doesUserExist } from "./UserModel.js";
import generateException from "../utils/exceptionGenerator.js";
import { getProductById } from "./ProductModel.js";

//For Admin
export const getAllOrders = async (page= 1, limit= 10, status= '', name='', paymentMethod= '', conn) =>{
    const offset = (page - 1) * limit;
    let query = `SELECT order_details.id AS order_id, 
        user.id AS user_id, user.name, 
        order_details.total_amount, 
        order_details.status, 
        order_details.payment_method 
        FROM order_details LEFT JOIN user 
        ON order_details.user_id = user.id 
        WHERE 1 = 1 `;
    
    const params = [];

    const allowedStatus = [
        'pending', 
        'processing', 
        'on the way', 
        'delivered', 
        'cancelled', 
        'completed'
    ];

    if(allowedStatus.includes(status)){
        query += 'AND order_details.status = ? ';
        params.push(status);
    }

    if(name){
        query += 'AND user.name LIKE ? ';
        params.push(`%${name}%`);
    }

    const allowedPaymentMethods = [
        'COD',
        'e-wallet',
        'credit/debit card',
    ];

    if(allowedPaymentMethods.includes(paymentMethod)){
        query += 'AND order_details.payment_method = ? ';
        params.push(paymentMethod);
    }

    query += 'LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await conn.query(query, params);
    return rows;
}

export const getAllOrdersCount = async (status= '', name='', paymentMethod= '', conn) =>{
    let query = `SELECT COUNT(*) AS total  
        FROM order_details LEFT JOIN user 
        ON order_details.user_id = user.id 
        WHERE 1 = 1`;
    
    const params = [];

    const allowedStatus = [
        'pending', 
        'processing', 
        'on the way', 
        'delivered', 
        'cancelled', 
        'completed'
    ];

    if(allowedStatus.includes(status)){
        query += 'AND order_details.status = ? ';
        params.push(status);
    }

    if(name){
        query += 'AND user.name LIKE ? ';
        params.push(`%${name}%`);
    }

    const allowedPaymentMethods = [
        'COD',
        'e-wallet',
        'credit/debit card',
    ];

    if(allowedPaymentMethods.includes(paymentMethod)){
        query += 'AND order_details.payment_method = ? ';
        params.push(paymentMethod);
    }

    const [[{total}]] = await conn.query(query, params);
    return total;
}

export const getOrderItemsById = async(id= -1, conn) =>{
    const oId = parseInt(id)

    if(!Number.isInteger(oId) || oId < 1){
        generateException('TypeError', 'Invalid order id.', 400);
    }

    const [result] = await conn.query(
        `SELECT order_details.id AS order_id, 
        user.id AS user_id, 
        user.name AS user_name, 
        order_details.total_amount, 
        order_details.status, 
        order_details.payment_method, 
        order_details.shipping_address, 
        order_item.product_id AS product_id, 
        product.name AS product_name, 
        product.thumbnail, 
        order_item.quantity, 
        order_item.price_at_time FROM order_item 
        LEFT JOIN product ON order_item.product_id = product.id 
        INNER JOIN order_details ON order_item.order_id = order_details.id 
        LEFT JOIN user ON order_details.user_id = user.id 
        WHERE order_details.id = ?`, [oId]);
    
    return result[0];
}

export const updateOrderStatus = async(orderId = -1, status='', conn) =>{
    const oId = parseInt(orderId);

    if(!Number.isInteger(oId) || oId < 1){
        generateException('TypeError', 'Invalid order id.', 400);
    }

    const allowedStatus = [
        'pending', 
        'processing', 
        'on the way', 
        'delivered', 
        'cancelled', 
        'completed'
    ];

    if(!allowedStatus.includes(status)){
        generateException('Error', 'Unknown status', 400);
    }

    const [[order]] = await conn.query("SELECT * FROM order_details WHERE id = ?", [oId]);

    if(!order){
        generateException('Error', 'Order not found', 404);
    }

    const [{affectedRows}] = await conn.query(`UPDATE order_details SET status = '${status}' WHERE id = ?`, [oId]);
    return affectedRows;
}

//For user
export const getAllOrdersByUser = async (userId = -1, page= 1, limit= 10, status= '', conn) =>{
    const offset = (page - 1) * limit;
    const uId = parseInt(userId);
    const params = [];
    
    if(!Number.isInteger(uId) || uId < 1){
        generateException('TypeError', 'Invalid user id.', 400);
    }

    doesUserExist(uId, conn);

    let query = `SELECT order_details.id AS order_id, 
        user.id AS user_id, user.name, 
        order_details.total_amount, 
        order_details.status, 
        order_details.payment_method 
        FROM order_details LEFT JOIN user 
        ON order_details.user_id = user.id 
        WHERE user.id = ? `;

    params.push(uId);

    const allowedStatus = [
        'pending', 
        'processing', 
        'on the way', 
        'delivered', 
        'cancelled', 
        'completed'
    ];

    if(allowedStatus.includes(status)){
        query += 'AND order_details.status = ? ';
        params.push(status);
    }

    query += 'LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await conn.query(query, params);
    return rows;
}

export const getAllOrdersCountByUser = async (userId = -1, status= '', conn) =>{
    const uId = parseInt(userId);
    const params = [];
    
    if(!Number.isInteger(uId) || uId < 1){
        generateException('TypeError', 'Invalid user id.', 400);
    }
    
    let query = `SELECT COUNT(*) AS total  
        FROM order_details LEFT JOIN user 
        ON order_details.user_id = user.id 
        WHERE user.id = ?`;
    params.push(uId);

    const allowedStatus = [
        'pending', 
        'processing', 
        'on the way', 
        'delivered', 
        'cancelled', 
        'completed'
    ];

    if(allowedStatus.includes(status)){
        query += 'AND order_details.status = ? ';
        params.push(status);
    }

    const [[{total}]] = await conn.query(query, params);
    return total;
}

export const getOrderItemsByOrderAndUser = async(orderId= -1, userId = -1, conn) =>{
    const uId = parseInt(userId);
    const oId = parseInt(orderId);

    if(!Number.isInteger(uId) || uId < 1){
        generateException('TypeError', 'Invalid user id.', 400);
    }

    if(!Number.isInteger(oId) || oId < 1){
        generateException('TypeError', 'Invalid order id.', 400);
    }

    doesUserExist(uId, conn);

    const [result] = await conn.query(
        `SELECT order_details.id AS order_id, 
        user.id AS user_id, 
        user.name AS user_name, 
        order_details.total_amount, 
        order_details.status, 
        order_details.payment_method, 
        order_details.shipping_address, 
        order_item.product_id AS product_id, 
        product.name AS product_name, 
        product.thumbnail, 
        order_item.quantity, 
        order_item.price_at_time FROM order_item 
        LEFT JOIN product ON order_item.product_id = product.id 
        INNER JOIN order_details ON order_item.order_id = order_details.id 
        LEFT JOIN user ON order_details.user_id = user.id 
        WHERE order_details.id = ? AND user.id = ?`, [oId, uId]);
    
    return result[0];
}

export const cancelOrder = async(userId= -1, orderId= -1, conn) =>{
    const uId = parseInt(userId);
    const oId = parseInt(orderId);

    if(!Number.isInteger(uId) || uId < 1){
        generateException('TypeError', 'Invalid user id.', 400);
    }

    if(!Number.isInteger(oId) || oId < 1){
        generateException('TypeError', 'Invalid order id.', 400);
    }

    doesUserExist(uId, conn);

    const [[order]] = await conn.query("SELECT * FROM order_details WHERE id = ? AND user_id = ?", [oId, uId]);

    if(!order){
        generateException('Error', 'Order not found.', 404);
    }

    if(order.status !== 'pending'){
        generateException('Error', `Unable to cancel your order. Your order no.${order.id} is ${order.status}.`, 400);
    }

    const [{affectedRows}] = await conn.query("UPDATE order_details SET status = 'cancelled' WHERE id = ? AND user_id = ?", [oId, uId]);

    return affectedRows;
}


//For creating new order
export const createNewOrder = async (orderDetails, conn) =>{
    const [result] = await conn.query(
        "INSERT INTO order_details(user_id, subtotal, shipping_fee, total_amount, status, payment_method, shipping_address) VALUES(?,?,?,?,?,?,?)",
    [
        orderDetails.userId, 
        orderDetails.subtotal, 
        orderDetails.shippingFee, 
        orderDetails.totalAmount, 
        orderDetails.status, 
        orderDetails.paymentMethod, 
        orderDetails.shippingAddress
    ]);

    if(!result.insertId){
        generateException('Error', 'Something went wrong.', 500);
    }

    return result.insertId;
}

export const createOrderItem = async (orderItem, conn) =>{
    const [result] = await conn.query('INSERT INTO order_item(order_id, product_id, quantity, price_at_time) VALUES(?,?,?,?)',
        [orderItem.orderId, orderItem.productId, orderItem.quantity, orderItem.priceAtTime]
    );
    
    if(!result.insertId){
        generateException('Error', 'Something went wrong', 500);
    }
}