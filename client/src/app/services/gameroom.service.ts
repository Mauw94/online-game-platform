import { Socket } from "socket.io-client";

class GameroomService {

    /**
     * Get the current room id of the socket.
     * @param socket 
     * @returns 
     */
    public async currentGameRoom(socket: Socket): Promise<string> {
        return new Promise((rs, rj) => {
            socket.emit('get_roomId');
            socket.on('roomId', (roomId: string) => rs(roomId));
            socket.on('not_in_room', () => rj());
        });
    }
}

export default new GameroomService();