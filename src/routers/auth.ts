import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/auth";
import { errorHandler } from "../errorHandeler";
import authMiddleware from "../middlewares/auth";

const authRoutes:Router = Router();

authRoutes.post('/register', errorHandler(register))
authRoutes.post('/login', errorHandler(login))
authRoutes.get('/', [authMiddleware], errorHandler(getCurrentUser))

export default authRoutes;