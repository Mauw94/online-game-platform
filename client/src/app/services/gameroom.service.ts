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

    /**
     * Get all the available game rooms to join.
     * @param socket 
     * @returns 
     */
    public async getAllAvailableRooms(socket: Socket): Promise<any> {
        return new Promise((rs, rj) => {
            rs(socket.emit('all_available_rooms'));
        });
    }

    /**
     * Listen to available rooms event.
     * @param socket 
     * @param listener 
     * @returns 
     */
    public async onGetAllAvailableRooms(socket: Socket, listener: (availableRooms: string[]) => void): Promise<void> {
        return new Promise((rs, rj) => {
            socket.on('on_all_available_rooms', (availableRooms) => rs(listener(availableRooms)));
        });
    }
}

export default new GameroomService();