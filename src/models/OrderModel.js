import { doesUserExist } from "./UserModel.js";
import generateException from "../utils/exceptionGenerator.js";
import { getProductById } from "./ProductModel.js";

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