import express from "express";
import * as categoryController from "../controllers/CategoryController.js";

const categoryRouters = express.Router();

categoryRouters.get('/all', categoryController.fetchCategory);
categoryRouters.post('/new', categoryController.createCategory);

categoryRouters.delete('/delete/:id', categoryController.removeCategoryById);

export default categoryRouters;