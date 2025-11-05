import express from 'express';
import * as ProductController from '../controllers/ProductController.js';

const productRouter = express.Router();

productRouter.get('/all', ProductController.fetchProducts);

export default productRouter;