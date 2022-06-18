import { Server, Socket } from "socket.io";
import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";

@SocketController()
export class RoomController {

    /**
     * Listen to client request of getting a room id (different than socket.id).
     * Emit roomid to the connected socket.
     * @param io 
     * @param socket 
     */
    @OnMessage('get_roomId')
    public async getRoomId(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
        const socketRooms = Array.from(socket.rooms.values()).filter(r => r !== socket.id);

        if (socketRooms.length > 0) {
            socket.emit('roomId', { roomId: socketRooms[0] });
        }
    }
}