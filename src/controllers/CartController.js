import * as CartModel from "../models/CartModel.js";
import connect from "../config/db.js";

export const addToCart = async (req, res, next) => {
    const {productId, userId, quantity} = req.body;
    
    //get Connection
    const conn = await connect();
    try{
        const updatedCart = await CartModel.addItemToCart(productId, userId, quantity, conn);
        await conn.end();
        res.status(201).json({
            success: true,
            message: [
                {result: 'A new product has been added to cart'},
                updatedCart
            ]
        })
    }catch(e){
        await conn.end();
        next(e);
    }
}

export const getCart = async (req, res, next) =>{
    const userId = req.params.id;

    //get Connection
    const conn = await connect();

    try{
        const cart = await CartModel.getCartItems(userId, conn);
        await conn.end();
        res.status(200).json({
            success: true,
            message: cart
        })
    }catch(e){
        await conn.end();
        next(e);
    }
}

export const updateCartItem = async(req, res, next) => {
    const {userId, cartId, quantity} = req.body;

    //get Connection
    const conn = await connect();
    try{
        const cart = await CartModel.updateCartItem(userId, cartId, quantity);
        await conn.end();
        res.status(200).json({
            success: true,
            message: [
                {result : "Cart item has been updated"},
                cart
            ]
        });
    }catch(e){
        await conn.end();
        next(e);
    }

}

export const deleteCartItem = async(req, res, next) =>{
    const {userId, cartId} = req.body;

    //get Connection
    const conn = await connect();
    try{
        const cart = await CartModel.deleteCartItem(userId, cartId);
        await conn.end();
        res.status(200).json({
            success: true,
            message: [
                {result: "Cart item has been deleted"},
                cart
            ]
        })
    }catch(e){
        await conn.end();
        next(e);
    }
}