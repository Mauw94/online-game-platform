import { io, Socket } from 'socket.io-client';

class SocketService {
    public socket: Socket | null = null;

    /**
     * Connect to the socket server.
     * @param url 
     * @returns 
     */
    public connect(url: string): Socket {
        this.socket = io(url);
        return this.socket;
    }

    /**
     * Get the game room id that is not the current socket's id.
     */
    public async getGameRoomId(socket: Socket) {
        socket.emit('get_roomId');
    }

    /**
     * Get the room id from the server.
     * @param socket 
     * @param roomId 
     */
    public async onGettingGameRoomId(socket: Socket, message: any) {
        socket.on('roomId', message);
    }
}

export default new SocketService();