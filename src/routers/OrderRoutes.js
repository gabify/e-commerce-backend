import express from "express";
import * as OrderController from "../controllers/OrderController.js";
import authHandler from "../middleware/authHandler.js";

const orderRouter = express.Router();

orderRouter.use(authHandler);

//for admin
orderRouter.get('/all', OrderController.fetchAllOrders);
orderRouter.get('/:orderId', OrderController.fetchOrderItemsByOrderId);
orderRouter.put('/edit/:orderId', OrderController.adminUpdateOrderStatus);

//for user
orderRouter.get('/user/:userId', OrderController.userFetchOrders);
orderRouter.get('/items', OrderController.userFetchOrderItems);
orderRouter.put('/cancel', OrderController.cancelOrder);

export default orderRouter;