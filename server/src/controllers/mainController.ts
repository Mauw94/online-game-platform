import { ConnectedSocket, OnConnect, SocketController, SocketIO } from "socket-controllers";
import { Socket, Server } from 'socket.io';

@SocketController()
export class MainController {

    /**
     * Listener for on socket connection.
     * @param socket 
     * @param io 
     */
    @OnConnect()
    public onConnection(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
        console.log('new socket connected: ', socket.id);
    }
}