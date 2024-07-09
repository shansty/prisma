import { Router } from "express";
import { errorHandler } from "../errorHandeler";
import authMiddleware from "../middlewares/auth";
import { addAddress, changeUserRole, deleteAddress, getUserById, listOfAddresses, listUsers, updateUser } from "../controllers/users";
import adminMiddleware from "../middlewares/admin";

const usersRoutes:Router = Router();

usersRoutes.post("/address", [authMiddleware], errorHandler(addAddress))
usersRoutes.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress))
usersRoutes.get("/address", [authMiddleware], errorHandler(listOfAddresses))
usersRoutes.put("/", [authMiddleware], errorHandler(updateUser))
usersRoutes.put("/:id/role", [authMiddleware, adminMiddleware], errorHandler(changeUserRole))
usersRoutes.get("/", [authMiddleware, adminMiddleware], errorHandler(listUsers))
usersRoutes.get("/:id", [authMiddleware, adminMiddleware], errorHandler(getUserById))

export default usersRoutes