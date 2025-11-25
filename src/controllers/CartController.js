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