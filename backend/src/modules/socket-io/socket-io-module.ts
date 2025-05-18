import { socketIoController } from "./contoller/socket-io-controller";
import { socketIoRoutes } from "./routes/socket-io-route";

export const socketIoModule = {
    routes: {
        v1: socketIoRoutes
    }
}