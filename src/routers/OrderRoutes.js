import express from "express";
import {fetchAllOrders} from "../controllers/OrderController.js";
import authHandler from "../middleware/authHandler.js";

const orderRouter = express.Router();

orderRouter.use(authHandler);
orderRouter.get('/all', fetchAllOrders);

export default orderRouter;