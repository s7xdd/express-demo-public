import express from "express";
import { socketIoController } from "../contoller/socket-io-controller";

export const socketIoRoutes = express.Router();

socketIoRoutes.get("/", socketIoController.getHandlder);