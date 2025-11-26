import connect from "../config/db.js";
import * as categoryModel from "../models/CategoryModel.js";

export const fetchCategory = async(req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    //get Connection
    const conn = await connect();
    const categories = await categoryModel.getCategory(page, limit, search, conn);
    await conn.end();
    res.status(200).json({success: true, message: categories});
}

export const fetchCategoryCount = async (req, res) =>{
    const search = req.query.search || '';

    //get Connection
    const conn = await connect();
    const total_categories = await categoryModel.getCategoryCount(search, conn);
    await conn.end();
    res.status(200).json({success: true, message: [total_categories]})
}

export const fetchCategoryById = async(req, res, next) =>{
    const id = req.params.id || -1;

    //get Connection
    const conn = await connect();
    try{
        const category = await categoryModel.getCategoryById(id, conn);
        await conn.end();
        if(category){
            res.status(200).json({success: true, message: [category]})
        }else{
            res.status(404).json({success: false, message: `Category with id: ${id} is not found`})
        }

    }catch(err){
        console.log(err);
        await conn.end();
        next(err);
    }
}

export const createCategory = async(req, res, next) => {
    const {name, description} = req.body;

    //get Connection
    const conn = await connect();
    try{
        const id = await categoryModel.insertCategory(name, description, conn);
        await conn.end();
        res.status(201).json({
            success: true,
            message: "New category successfully created",
            id
        })
    }catch(err){
        await conn.end();
        next(err);
    }
}

//Update category

export const updateCategory = async (req, res, next) =>{
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    //get Connection
    const conn = await connect();
    try{
        const updatedCategory = await categoryModel.updateCategory(name, description, id, conn);
        await conn.end();
        res.status(200).json({success: true, message: [{updatedCategory}]})
    }catch(err){
        console.log(err);
        await conn.end();
        next(err);
    }
}

//Delete category
export const removeCategoryById = async (req, res, next) =>{
    const id = parseInt(req.params.id) || -1;

    //get Connection
    const conn = await connect();
    try{
        const deletedCategory = await categoryModel.updateAsInactive(id, conn);
        await conn.end();
        res.status(200).json({success: true, message: [{deletedCategory}]});
    }catch(err){
        console.log(err);
        await conn.end();
        next(err);
    }
}