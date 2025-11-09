import * as ProductModel from "../models/ProductModel.js";

export const fetchProducts = async (req, res) =>{
    const products = await ProductModel.getProducts();
    res.status(200).json({success: true, message: products});
}

export const createProduct = async (req, res, next) =>{
    try{
        const file = req.file;
        const {name, description, price, stock_quantity, category_id} = req.body;

        const thumbnail = file ? file.filename : null;
        const product = {name, description, price, stock_quantity, category_id, thumbnail}

        const insertId = await ProductModel.insertProduct(product);
        res.status(200).json({
          success: true, 
          message: "Product created successfully", 
          id: insertId, 
          thumbnail_url: file ? `/product/thumbnails/${file.filename}` : null
        });

    }catch(e){
        next(e);
    }
}