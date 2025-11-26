import express from "express";
import * as CartController from "../controllers/CartController.js";
import authHandler from "../middleware/authHandler.js";
import {checkout} from "../controllers/OrderController.js";

const cartRouter = express.Router();

cartRouter.use(authHandler);
cartRouter.get('/all/:id', CartController.getCart);
cartRouter.post('/new', CartController.addToCart);
cartRouter.post('checkout', checkout);
cartRouter.put('/edit', CartController.updateCartItem);
cartRouter.delete('/delete', CartController.deleteCartItem);

export default cartRouter;