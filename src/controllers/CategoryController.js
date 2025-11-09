import * as categoryModel from "../models/CategoryModel.js";

export const fetchCategory = async(req, res) =>{
    const categories = await categoryModel.getCategory();
    res.status(200).json({success: true, message: categories});
}

export const createCategory = async(req, res, next) => {
    const {name, description} = req.body;

    try{
        const id = await categoryModel.insertCategory(name, description);
        res.status(201).json({
            success: true,
            message: "New category successfully created",
            id
        })
    }catch(err){
        next(err)
    }
}