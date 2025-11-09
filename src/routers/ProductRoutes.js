import express from 'express';
import * as ProductController from '../controllers/ProductController.js';
import imageUploadHandler from '../../middleware/imageUploadHandler.js';

const productRouter = express.Router();

productRouter.get('/all', ProductController.fetchProducts);
productRouter.post('/new', imageUploadHandler.single("thumbnail"), ProductController.createProduct);

export default productRouter;