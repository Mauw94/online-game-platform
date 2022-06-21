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

        console.log(socketRooms);

        if (socketRooms.length > 0) {
            socket.emit('roomId', { roomId: socketRooms[0] });
        } else {
            socket.emit('no_in_room');
        }
    }

    /**
     * Listens for join_game event for a user to join a game room.
     * @param socket 
     * @param io 
     * @param message 
     */
    @OnMessage('join_game')
    public async joinGame(@ConnectedSocket() socket: Socket, @SocketIO() io: Server, @MessageBody() message: any) {
        console.log(socket.id, ' joins room');
        const connectedSockets = io.sockets.adapter.rooms.get(message.roomId); // Get all the connected sockets to this room
        const socketRooms = Array.from(socket.rooms.values()).filter(r => r !== socket.id); // The rooms the socket is connected to.

        // This socket is already connected to a room or the current room is full.
        if (socketRooms.length > 0 || connectedSockets && connectedSockets.size == 2) {
            socket.emit('room_join_error', {
                error: 'Room is full, please join another room.'
            });
        } else {
            await socket.join(message.roomId);
            socket.emit('room_joined');

            if (connectedSockets.size == 2) {
                socket.emit('room_full');
                socket.to(message.roomId).emit('room_full');
            }
        }
    }

}