import express from "express";
import * as categoryController from "../controllers/CategoryController.js";
import authHandler from "../middleware/authHandler.js";

const categoryRouters = express.Router();

categoryRouters.use(authHandler);
categoryRouters.get('/all', categoryController.fetchCategory);
categoryRouters.post('/new', categoryController.createCategory);

categoryRouters.put('/edit/:id', categoryController.updateCategory);

categoryRouters.delete('/delete/:id', categoryController.removeCategoryById);

export default categoryRouters;