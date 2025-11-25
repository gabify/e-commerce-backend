import * as CartModel from "../models/CartModel.js";

export const addToCart = async (req, res, next) => {
    const {productId, userId, quantity} = req.body;
    
    try{
        const updatedCart = await CartModel.addItemToCart(productId, userId, quantity);
        res.status(201).json({
            success: true,
            message: [
                {result: 'A new product has been added to cart'},
                updatedCart
            ]
        })
    }catch(e){
        next(e);
    }
}

export const getCart = async (req, res, next) =>{
    const userId = req.params.id;

    try{
        const cart = await CartModel.getCartItems(userId);
        res.status(200).json({
            success: true,
            message: cart
        })
    }catch(e){
        next(e);
    }
}

export const updateCartItem = async(req, res, next) => {
    const {userId, cartId, quantity} = req.body;

    try{
        const cart = await CartModel.updateCartItem(userId, cartId, quantity);
        res.status(200).json({
            success: true,
            message: [
                {result : "Cart item has been updated"},
                cart
            ]
        });
    }catch(e){
        next(e);
    }

}

export const deleteCartItem = async(req, res, next) =>{
    const {userId, cartId} = req.body;

    try{
        const cart = await CartModel.deleteCartItem(userId, cartId);
        res.status(200).json({
            success: true,
            message: [
                {result: "Cart item has been deleted"},
                cart
            ]
        })
    }catch(e){
        next(e);
    }
}