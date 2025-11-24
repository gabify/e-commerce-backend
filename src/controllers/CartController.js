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