import { BehaviorSubject } from "rxjs";
import { Socket } from "socket.io-client";
import { IBoard } from "../lib/shared/interfaces/IBoard";
import { IStartGame } from "../lib/shared/interfaces/IStartGame";
import { GameType } from "../lib/shared/enums/gameType";
import { CellEnum } from "../lib/shared/enums/CellEnum";

class GameService {

    public isInRoom: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public roomId: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public playerToPlay: BehaviorSubject<CellEnum> = new BehaviorSubject<CellEnum>(CellEnum.EMPTY);
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
    public async joinGameRoom(socket: Socket, roomId: string, gameType: GameType): Promise<boolean> {
        return new Promise((rs, rj) => {
            socket.emit('join_game', { roomId: roomId, gameType: gameType });
            socket.on('room_joined', () => rs(true));
            socket.on('room_join_error', ({ error }) => rj(error));
        });
    }

    // TODO: check for some rewrite in .emit and .on 
    // TODO: make all the methods return resolve promises.

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
    public async onGameUpdate(socket: Socket, listener: (boardState: IBoard, playerToPlay: CellEnum) => void): Promise<any> {
        return new Promise((rs, rj) => {
            rs(socket.on('on_game_update', ({ boardState, playerToPlay }) => listener(boardState, playerToPlay)));
        });
    }

    /**
     * Send game update to the server.
     * @param socket 
     * @param board 
     */
    public async updateGame(socket: Socket, board: IBoard, playerToPlay: CellEnum) {
        socket.emit('update_game', { boardState: board, playerToPlay: playerToPlay });
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
     * Restart the game.
     * @param socket 
     * @param roomid 
     * @param gameType
     */
    public async restartGame(socket: Socket, roomId: string, gameType: GameType): Promise<any> {
        return new Promise((rs, rj) => {
            rs(socket.emit('restart_game', { roomId: roomId, gameType: gameType }));
        });
    }

    /**
     * Check if there's a game in progress.
     * @param socket 
     */
    public async checkGameInProgress(socket: Socket) {
        socket.emit('check_game_inprogress');
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