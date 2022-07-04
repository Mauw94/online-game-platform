import { BehaviorSubject } from "rxjs";
import { Socket } from "socket.io-client";
import { GameType } from "../lib/shared/enums/gameType";
import { PlayerIdentifier } from "../lib/shared/enums/PlayerIdentifier";

class GameService {

    public isInRoom: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public roomId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
    public playerToPlay: BehaviorSubject<PlayerIdentifier> = new BehaviorSubject<PlayerIdentifier>(PlayerIdentifier.EMPTY);
    public roomFull: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public gameType: BehaviorSubject<GameType> = new BehaviorSubject<GameType>(GameType.TICTACTOE);

    /**
     * Join a game room.
     * Emit join_game to the server
     * Recive room_joing or room_join_error back from the server.
     * @param socket 
     * @param roomId 
     * @returns 
     */
    public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
        return new Promise((rs, rj) => {
            socket.emit('join_game', { roomId: roomId });
            socket.on('room_joined', () => rs(true));
            socket.on('room_join_error', ({ error }) => rj(error));
        });
    }

    /**
     * Leave the current game room.
     * @param socket 
     * @param roomId 
     * @returns 
     */
    public async leaveGameRoom(socket: Socket, roomId: string): Promise<boolean> {
        return new Promise((rs, rj) => {
            socket.emit('leave_room', { roomId: roomId });
            rs(true);
        });
    }

    /**
     * Have connected sockets listen to room full event.
     * @param socket 
     * @param listener 
     */
    public async listenToRoomFull(socket: Socket, listener: (options: any) => void): Promise<any> {
        return new Promise((rs, rj) => {
            rs(socket.on('room_full', listener));;
        });
    }

    /**
     * Start a new game.
     * @param socket 
     * @param listener 
     */
    public async onStartGame(socket: Socket, listener: (options: any) => void): Promise<any> {
        return new Promise((rs, rj) => {
            rs(socket.on('start_game', listener));
        });
    }

    /**
     * Receive game update from the server..
     * @param socket 
     * @param listener 
     */
    public async onGameUpdate(socket: Socket, listener: (gameState: any, playerToPlay: PlayerIdentifier) => void): Promise<any> {
        return new Promise((rs, rj) => {
            rs(socket.on('on_game_update', ({ gameState, playerToPlay }) => listener(gameState, playerToPlay)));
        });
    }

    /**
     * Send game update to the server.
     * @param socket 
     * @param board 
     */
    public async updateGame(socket: Socket, gameState: any, playerToPlay: PlayerIdentifier) {
        socket.emit('update_game', { gameState: gameState, playerToPlay: playerToPlay });
    }

    /**
     * Start a new game.
     * @param socket 
     * @param message 
     */
    public async startGame(socket: Socket, message: any) {
        socket.emit('on_start_game', message);
    }

    /**
     * Update when a player wins.
     * @param socket 
     * @param message
     */
    public async gameWin(socket: Socket, message: string) {
        socket.emit('game_win', { message });
    }

    /**
     * Listen to on game win.
     * @param socket 
     * @param listener 
     */
    public async onGameWin(socket: Socket, listener: (message: string) => void): Promise<any> {
        return new Promise((rs, rj) => {
            rs(socket.on('on_game_win', ({ message }) => listener(message)));
        });
    }

    /**
     * Checks if 2 players are on the same page to start the game.
     * @param socket 
     * @param roomId 
     * @param gameType 
     */
    public async checkGameRoomState(socket: Socket, message: any): Promise<any> {
        return new Promise((rs, rj) => {
            rs(socket.emit('in_game', { roomId: message.roomId, gameType: message.gameType, letterCount: message.letterCount }));
        });
    }

    /**
     * Listen to gamestate found event.
     * @param socket 
     * @param listener 
     */
    public async onGameFound(socket: Socket, message: any) {
        socket.on('found_gamestate', message);
    }
}

export default new GameService();