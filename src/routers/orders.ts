import { Router } from "express";
import { errorHandler } from "../errorHandeler";
import authMiddleware from "../middlewares/auth";
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrders, listOfOrders, listOfUserOrders } from "../controllers/orders";

const orderRoutes:Router = Router();

orderRoutes.post("/", [authMiddleware], errorHandler(createOrder))
orderRoutes.get("/", [authMiddleware], errorHandler(listOfOrders))
orderRoutes.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder))
orderRoutes.get("/index", [authMiddleware], errorHandler(listAllOrders))
orderRoutes.get("/users/:id", [authMiddleware], errorHandler(listOfUserOrders))
orderRoutes.put("/:id/status", [authMiddleware], errorHandler(changeStatus))
orderRoutes.get("/:id", [authMiddleware], errorHandler(getOrderById))


export default orderRoutes