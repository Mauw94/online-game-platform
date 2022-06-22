import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Socket, Server } from "socket.io";
import { GameType } from "../lib/shared/enums/gameType";
import wordDictionaryReader from "../utils/wordDictionaryReader";

@SocketController()
export class GameController {

    private static gameStates: Map<string, any> = new Map<string, any>(); // key = room id, value = gamestarted, gamestate, playerturn

    /**
     * Return local gamestates.
     * @returns 
     */
    public static getStates(): Map<string, any> {
        return this.gameStates;
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
        const gameState = GameController.gameStates.get(gameRoom);

        // update gamestate
        gameState.gameState = message.gameState;
        gameState.playerToPlay = message.playerToPlay;
        GameController.gameStates.set(gameRoom, gameState);

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
        GameController.gameStates.delete(gameRoom); // Remove from gamestates to reduce memory usage

        socket.to(gameRoom).emit('on_game_win', message);
    }

    /**
     * Check if there's a game in progress for the current socket and room.
     * @param io 
     * @param socket 
     */
    @OnMessage('game_progress')
    public async checkGameProgress(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        const gameRoom = this.getSocketGameRoom(socket);
        const gameState = GameController.gameStates.get(gameRoom);

        if (gameState && gameState.game === message.game) {
            socket.emit('found_gamestate', { gameStarted: gameState.started, playerToPlay: gameState.playerToPlay, gameState: gameState.gameState });
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
                    GameController.gameStates.set(message.roomId, { startTime: new Date(), game: 'tictactoe', started: true, playerToPlay: {}, gameState: {} });
                    break;
                case GameType.WORDGUESSER:
                    this.startWordGuesser(socket, message);
                    GameController.gameStates.set(message.roomId, { startTime: new Date(), game: 'lingo', started: true, playerToPlay: {}, gameState: {} });
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
        socket.emit('start_game', { start: true, symbol: 'x', game: 'tictactoe' });
        socket.to(message.roomId).emit('start_game', { start: false, symbol: 'o', game: 'tictactoe' });
    }

    /**
     * Start new word guesser game.
     * @param socket 
     * @param message 
     */
    private async startWordGuesser(socket: Socket, message: any): Promise<void> {
        console.log(message.letterCount);
        var wordToGuess = await wordDictionaryReader.getRandomWordAsync(message.letterCount);

        socket.emit('start_game', { start: true, wordToGuess: wordToGuess, symbol: 'x', game: 'lingo' });
        socket.to(message.roomId).emit('start_game', { start: false, wordToGuess: wordToGuess, symbol: 'o', game: 'lingo' });
    }

}
