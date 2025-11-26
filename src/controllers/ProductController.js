import connect from "../config/db.js";
import * as ProductModel from "../models/ProductModel.js";


export const fetchProducts = async (req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category_id = parseInt(req.query.category_id) || 0;
    const search = req.query.search || '';
    const price_range = parseInt(req.query.range) || 0;

    //get Connection
    const conn = await connect();
    const [products, total] = await Promise.all([
        ProductModel.getProducts(page, limit, category_id, search, price_range, conn), 
        ProductModel.getProductCount(conn)
    ]);
    conn.release();

    res.status(200).json({
        success: true, 
        message: [
            products,
            {total_page : Math.ceil(total/limit)}
        ]
    });
}

export const fetchProductCount = async (req, res) =>{
    const limit = parseInt(req.query.limit) || 10;
    const category_id = parseInt(req.query.category_id) || 0;
    const search = req.query.search || '';
    const price_range = parseInt(req.query.range) || 0;

    //get Connection
    const conn = await connect();
    const total_products = await ProductModel.getProductCount(limit, category_id, search, price_range, conn);
    conn.release();
    res.status(200).json({success: true, message: [total_products]})
}

export const fetchProductById = async (req, res, next) =>{
    const id = parseInt(req.params.id) || -1;

    //get Connection
    const conn = await connect();
    try{
        const product = await ProductModel.getProductById(id, conn);
        conn.release();

        if(product){
            res.status(200).json({success: true, message: [product]});
        }else{
            res.status(404).json({success: false, message: `Product with id: ${id} is not found`});
        }

    }catch(err){
        console.log(err);
        conn.release();
        next(err);
    }
}

export const createProduct = async (req, res, next) =>{
    try{
        const file = req.file;
        const {name, description, price, stock_quantity, category_id} = req.body;

        const thumbnail = file ? file.filename : null;
        const product = {name, description, price, stock_quantity, category_id, thumbnail}

        //get Connection
        const conn = await connect();
        const insertId = await ProductModel.insertProduct(product, conn);
        conn.release();
        res.status(200).json({
          success: true, 
          message: [
            {result: "Product created successfully",},
            {id: insertId},
            {thumbnail_url: file ? `/product/thumbnails/${file.filename}` : null}
          ] 
        });

    }catch(e){
        conn.release();
        next(e);
    }
}

export const editProduct = async (req, res, next) =>{
    const productId = parseInt(req.params.id);
    const file = req.file;

    //get Connection
    const conn = await connect();
    try{   
        const newProduct = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock_quantity: req.body.stock_quantity,
            category_id: req.body.category_id,
            thumbnail: file ? file.filename : undefined
        }

        const updatedProduct = await ProductModel.updateProduct(newProduct, productId, conn);
       conn.release();
        res.status(200).json({
            success: true,
            message: [
                {result: `Product with ID: ${productId} has been updated.`},
            ]
        })
    }catch(e){
        conn.release();
        next(e)
    }
}

export const deleteProduct = async (req, res, next) =>{
    const id = parseInt(req.params.id);

    //get Connection
    const conn = await connect();
    try{
        const deletedId = await ProductModel.deleteProduct(id, conn);
        conn.release();
        res.status(200).json({
            success: true,
            message: [
                {result: `Product with ID: ${id} has been deleted.`},
            ]
        })
    }catch(e){
        conn.release();
        next(e);
    }
}