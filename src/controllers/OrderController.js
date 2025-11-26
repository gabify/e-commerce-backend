import connect from "../config/db.js";
import { validateCartItems, clearCart, getCartItems } from "../models/CartModel.js";
import * as OrderModel from "../models/OrderModel.js";
import { updateProduct } from "../models/ProductModel.js";
import { doesUserExist } from "../models/UserModel.js";
import generateException from "../utils/exceptionGenerator.js";

export const checkout = async (req, res, next) =>{
    const {userId, address} = req.body;
    
    //get Connection
    const conn = await connect();
    try{
        const uId = Number(userId);
        if(!Number.isInteger(uId) || uId < 1){
            generateException('TypeError', 'Invalid user id.', 400);
        }
        //check if user exist
        await doesUserExist(uId, conn);

        if(address.trim() === ''){
            generateException('Error', 'Invalid address', 400);
        }
        //get cart items
        const cart = await getCartItems(uId, conn);

        //check if cart is not empty
        if(cart.length < 1) generateException('Error', 'Cart items not found', 404);

        //validate cart items
        const validatedCartItems = await CartModel.validateCartItems(cart, conn);

        //calculate subtotal
        const subtotal = validatedCartItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.product.price)), 0);

        //will add other logic for shipping fee
        let shippingFee;
        if(subtotal > 1000){
            shippingFee = 0;
        }else{
            shippingFee = 50;
        }

        //create order details
        const orderDetails = {
            userId : uId,
            subtotal,
            shippingFee,
            totalAmount: subtotal + shippingFee,
            status: "pending",
            paymentMethod: "COD",
            shippingAddress: address
        };

        //start transaction for checkout process
        await conn.beginTransaction();

        const orderId = await OrderModel.createNewOrder(orderDetails, conn);

        for(const item of validatedCartItems){
            const orderItem = {
                orderId,
                productId: item.product.id,
                quantity: item.quantity,
                priceAtTime: item.product.price
            }

            await OrderModel.createOrderItem(orderItem, conn);

            const newProduct = item.product;
            newProduct.stock_quantity -= item.quantity;

            const updatedProduct = await updateProduct(newProduct, newProduct.id, conn);

            if(!updatedProduct){
                generateException('Error', 'Something went wrong', 500);
            }
        }

        if(!CartModel.clearCart(uId, conn)){
            generateException('Error', 'Something went wrong', 500);
        }

        await conn.commit();
        conn.release();

        res.status(201).json({
            success: true,
            message: [
                {result: "Order completed!"}
            ]
        })
    }catch(e){
        await conn.rollback();
        next(e);
    }finally{
        conn.release();
    }
}

//For admin
export const fetchAllOrders = async(req, res, next) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name || '';
    const status = req.query.status || '';
    const paymentMethod = req.query.payment_method || '';

    const conn = await connect();

    const [orders, count] = await Promise.all([
        OrderModel.getAllOrders(page,limit, status, name, paymentMethod, conn),
        OrderModel.getAllOrdersCount(status, name, paymentMethod, conn)
    ]);
    conn.release();
    res.status(200).json({
        success: true,
        message: [
            orders,
            {total_page: Math.ceil(count/limit)}
        ]
    });
}

export const fetchOrderItemsByOrderId = async (req, res, next) =>{
    const {orderId} = req.params.orderId;

    const conn = await connect();
    try{
        const order = await OrderModel.getOrderItemsById(orderId, conn);
        conn.release();
        res.status(200).json({
            success: true,
            message: [
                order
            ]
        })
    }catch(e){
        conn.release();
        next();
    }

}

export const adminUpdateOrderStatus = async (req, res, next) =>{
    const {status} = req.body;
    const orderId = req.params.orderId;

    const conn = await connect();

    try{
        await OrderModel.updateOrderStatus(orderId, status, conn);
        conn.release();
        res.status(200).json({
            success: true,
            message: [
                {result: `Order no. ${orderId} has been updated successfully`}
            ]
        });
    }catch(e){
        conn.release();
        next(e);
    }
}

//For user
export const userFetchOrders = async (req, res, next) =>{
    const userId = parseInt(req.params.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';

    const conn = await connect();

    try{
        const [orders, count] = await Promise.all([
            OrderModel.getAllOrdersByUser(userId, page, limit, status, conn),
            OrderModel.getAllOrdersCountByUser(userId, status, conn)
        ]);

        conn.release();
        res.status(200).json({
            success: true,
            message: [
                orders,
                {total_page: Math.ceil(count/limit)}
            ]
        });
    }catch(e){
        conn.release();
        next(e);
    }
}

export const userFetchOrderItems = async (req, res, next) =>{
    const userId = req.query.userId;
    const orderId = req.query.orderId;

    const conn = await connect();

    try{
        const orderItems = await OrderModel.getOrderItemsByOrderAndUser(orderId, userId, conn);
        conn.release();
        res.status(200).json({
            success: true,
            message: [
                orderItems
            ]
        });
    }catch(e){
        conn.release();
        next(e);
    }
}

export const cancelOrder = async (req, res, next) =>{
    const userId = req.query.userId;
    const orderId = req.query.orderId;

    const conn = await connect();

    try{
        await OrderModel.cancelOrder(userId, orderId, conn);
        conn.release();
        res.status(200).json({
            success: true,
            message: [
                {result: `Order no. ${orderId} has been updated cancelled`}
            ]
        });
    }catch(e){
        conn.release();
        next(e);
    }
}