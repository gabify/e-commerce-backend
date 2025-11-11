import * as ProductModel from "../models/ProductModel.js";

export const fetchProducts = async (req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category_id = parseInt(req.query.category_id) || 0;
    const search = req.query.search || '';
    const price_range = parseInt(req.query.range) || 0;

    const [products, total] = await Promise.all([
        ProductModel.getProducts(page, limit, category_id, search, price_range), 
        ProductModel.getProductCount()
    ]);

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

    const total_products = await ProductModel.getProductCount(limit, category_id, search, price_range);
    res.status(200).json({success: true, message: [total_products]})
}

export const fetchProductById = async (req, res, next) =>{
    const id = parseInt(req.params.id) || -1;

    try{
        const product = await ProductModel.getProductById(id);

        if(product){
            res.status(200).json({success: true, message: [product]});
        }else{
            res.status(404).json({success: false, message: `Product with id: ${id} is not found`});
        }

    }catch(err){
        console.log(err);
        next(err);
    }
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
          message: [
            {text: "Product created successfully",},
            {id: insertId},
            {thumbnail_url: file ? `/product/thumbnails/${file.filename}` : null}
          ] 
        });

    }catch(e){
        next(e);
    }
}