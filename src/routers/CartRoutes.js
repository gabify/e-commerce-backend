import express from "express";
import * as CartController from "../controllers/CartController.js";
import authHandler from "../middleware/authHandler.js";

const cartRouter = express.Router();

cartRouter.use(authHandler);
cartRouter.get('/all/:id', CartController.getCart);
cartRouter.post('/new', CartController.addToCart);
cartRouter.put('/edit', CartController.updateCartItem);

export default cartRouter;