import express from 'express';
import * as ProductController from '../controllers/ProductController.js';
import imageUploadHandler from '../middleware/imageUploadHandler.js';

const productRouter = express.Router();

productRouter.get('/all', ProductController.fetchProducts);
productRouter.get('/all/count', ProductController.fetchProductCount);
productRouter.get('/:id', ProductController.fetchProductById);  
productRouter.post('/new', imageUploadHandler.single("thumbnail"), ProductController.createProduct);
productRouter.put('/edit/:id', imageUploadHandler.single("thumbnail"), ProductController.editProduct);
productRouter.delete('/delete/:id', ProductController.deleteProduct);

export default productRouter;