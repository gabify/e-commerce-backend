import express from "express";
import * as CartController from "../controllers/CartController.js";
import authHandler from "../middleware/authHandler.js";

const cartRouter = express.Router();

cartRouter.use(authHandler);
cartRouter.post('/new', CartController.addToCart);

export default cartRouter;