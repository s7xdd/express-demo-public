import { Router } from "express";
import { socketIoModule } from "../modules/socket-io/socket-io-module";

const socketIoRouter = Router();

socketIoRouter.use("/", socketIoModule.routes.v1)

export default socketIoRouter;