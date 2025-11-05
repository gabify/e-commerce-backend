import * as ProductModel from "../models/ProductModel.js";

export const fetchProducts = async (req, res) =>{
    const products = await ProductModel.getProducts();
    res.status(200).json({success: true, message: products});
}