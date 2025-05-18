
let socketTotal = new Set();

export const socketIoOnConnectionFunctions = (socket: any) => {
    console.log("A user connected");
    socketTotal.add(socket.id);
    socket.emit('total-clients', socketTotal.size);

    socket.on("chat message", (msg: any) => {
        socket.broadcast.emit("chat message", msg);
        console.log("message: " + msg);
    });

    socket.on("disconnect", () => {
        socketTotal.delete(socket.id);
        socket.emit("total-clients", socketTotal.size);
        console.log("A user disconnected");
    });
}