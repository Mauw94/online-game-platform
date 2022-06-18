import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Socket, Server } from "socket.io";
import { GameType } from "../lib/shared/enums/gameType";
import wordDictionaryReader from "../utils/wordDictionaryReader";

@SocketController()
export class TicTacToeGameController {

    private gameStates: Map<string, any> = new Map<string, any>(); // key = room id, value = gamestate

    /**
     * Listens for join_game event for a user to join a game room.
     * @param socket 
     * @param io 
     * @param message 
     */
    @OnMessage('join_game')
    public async joinGame(@ConnectedSocket() socket: Socket, @SocketIO() io: Server, @MessageBody() message: any) {
        console.log('joining room..');
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

    /**
     * Receive a start request from the client. Emit event back to the client to start the game.
     * @param io 
     * @param socket 
     * @param message 
     */
    @OnMessage('on_start_game')
    public async onStartGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        this.startNewGame(io, socket, message);
    }

    /**
     * Send game restart event.
     * @param io 
     * @param socket 
     * @param message 
     */
    @OnMessage('restart_game')
    public async restartGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        this.startNewGame(io, socket, message);
    }

    /**
     * Update the game.
     * @param io 
     * @param socket 
     * @param message 
     */
    @OnMessage('update_game')
    public async updateGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        const gameRoom = this.getSocketGameRoom(socket);
        socket.emit('on_game_update', message);
        socket.to(gameRoom).emit('on_game_update', message);
    }

    /**
     * Update when someone wins the game.
     * @param io 
     * @param socket 
     * @param message 
     */
    @OnMessage('game_win')
    public async onGameWin(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        const gameRoom = this.getSocketGameRoom(socket);
        socket.to(gameRoom).emit('on_game_win', message);
    }

    /**
     * Check if there's a game in progress for the current socket and room.
     * @param io 
     * @param socket 
     */
    @OnMessage('game_progress')
    public async checkGameProgress(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        console.log('getting here?');
        const gameRoom = this.getSocketGameRoom(socket);
        const gameState = this.gameStates.get(gameRoom);
        console.log(gameRoom);
        console.log(gameState);
        if (gameState) {
            socket.emit('found_gamestate', { gameStarted: gameState.started });
        }
    }

    /**
     * Get the room that the socket is connected to. (not the socket.id room)
     * @param socket 
     * @returns 
     */
    private getSocketGameRoom(socket: Socket): string {
        const socketRooms = Array.from(socket.rooms.values()).filter(r => r !== socket.id);
        const gameRoom = socketRooms && socketRooms[0];

        return gameRoom;
    }

    /**
     * Start a new game, depending on the gametype.
     * @param io 
     * @param socket 
     * @param message 
     */
    private startNewGame(io: Server, socket: Socket, message: any): void {
        if (io.sockets.adapter.rooms.get(message.roomId)?.size === 2) {
            switch (message.gameType) {
                case GameType.TICTACTOE:
                    this.startTicTacToe(socket, message)
                    this.gameStates.set(message.roomId, { game: 'tictactoe', started: true });
                    break;
                case GameType.WORDGUESSER:
                    this.startWordGuesser(socket, message);
                    this.gameStates.set(message.roomId, { game: 'lingo', started: true });
                    break;
            }
        }
    }

    /**
     * Start new tic tac toe game.
     * @param socket 
     * @param message 
     */
    private startTicTacToe(socket: Socket, message: any): void {
        socket.emit('start_game', { start: true, symbol: 'x' });
        socket.to(message.roomId).emit('start_game', { start: false, symbol: 'o' });
    }

    /**
     * Start new word guesser game.
     * @param socket 
     * @param message 
     */
    private async startWordGuesser(socket: Socket, message: any): Promise<void> {
        var wordToGuess = await wordDictionaryReader.getRandomWordAsync(message.letterCount);

        socket.emit('start_game', { start: true, wordToGuess: wordToGuess });
        socket.to(message.roomId).emit('start_game', { start: false, wordToGuess: wordToGuess });
    }

}
