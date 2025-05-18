import { connectDb } from "./src/config/db/db-connect";

import { app, io, server } from "./src/config/app/app-config";

import { errorHandler } from "./src/shared/middlewares/error/error-middleware";
import frontEndRouter from "./src/app/frontend-router";
import adminRouter from "./src/app/admin-router";
import socketIoRouter from "./src/app/socket-io-router";
import { socketIoOnConnectionFunctions } from "./src/modules/socket-io/functions/socket-io-server-functions";

//Front end routes
app.use("/api", frontEndRouter);

//Admin Routes
app.use("/admin/v1", adminRouter);

//SOCKET IO
app.use("/socket-io", socketIoRouter);
io.on("connection", socketIoOnConnectionFunctions);




app.use(errorHandler);

connectDb().then((res) => {
  console.log(res);
});

server.listen(process.env.PORT || 3000, () => console.log("Example app listening on port 3000!"));
