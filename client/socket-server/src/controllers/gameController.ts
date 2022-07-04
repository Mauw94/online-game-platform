import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { Socket, Server } from "socket.io";
import { GameStateHandler } from "../gs/gameStateHandler";
import { GameType } from "../lib/shared/enums/gameType";
import wordDictionaryReader from "../utils/dictionaryReader";


@SocketController()
export class GameController {

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
     * Update the game.
     * @param io 
     * @param socket 
     * @param message 
     */
    @OnMessage('update_game')
    public async updateGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        const gameRoom = this.getSocketGameRoom(socket);
        const gameState = GameStateHandler.getState(gameRoom);



        // update gamestate
        gameState.state = message.gameState;
        gameState.playerToPlay = message.playerToPlay;

        console.log(gameState);
        
        GameStateHandler.setState(gameRoom, gameState);

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
        console.log('game is won');
        const gameRoom = this.getSocketGameRoom(socket);
        console.log(gameRoom);
        GameStateHandler.deleteState(gameRoom); // Remove from gamestates to reduce memory usage

        socket.to(gameRoom).emit('on_game_win', message);
    }

    /**
     * Track who's in the game room and in the game.
     * @param socket 
     * @param io 
     * @param message 
     */
    @OnMessage('in_game')
    public async inGameRoomAndInGame(@ConnectedSocket() socket: Socket, @SocketIO() io: Server, @MessageBody() message: any) {
        console.log('------checking the game room state ------');
        const gameState = GameStateHandler.getState(message.roomId);
        console.log(gameState);
        if (gameState !== undefined && gameState.gameType === message.gameType) {
            if (!gameState.players.includes(socket.id)) {
                console.log('added the 2nd player');
                gameState.players.push(socket.id);
            }
            if (gameState.players.length > 1) {
                gameState.started = true;
                this.startNewGame(io, socket, message);
            }
        } else {
            GameStateHandler.setState(message.roomId, { startTime: new Date(), gameType: message.gameType, started: false, playerToPlay: '', state: {}, players: [socket.id] });
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
                    break;
                case GameType.WORDGUESSER:
                    this.startWordGuesser(socket, message);
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
        socket.emit('start_game', { start: true, symbol: 'o', gameType: message.gameType });
        socket.to(message.roomId).emit('start_game', { start: false, symbol: 'x', gameType: message.gameType });
    }

    /**
     * Start new word guesser game.
     * @param socket 
     * @param message 
     */
    private async startWordGuesser(socket: Socket, message: any): Promise<void> {
        var wordToGuess = await wordDictionaryReader.retrieveWord(message.letterCount);

        socket.emit('start_game', { start: true, wordToGuess: wordToGuess, symbol: 'x', gameType: message.gameType });
        socket.to(message.roomId).emit('start_game', { start: false, wordToGuess: wordToGuess, symbol: 'o', gameType: message.gameType });
    }

}
