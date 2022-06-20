import { Component, OnInit } from '@angular/core';
import { PlayerIdentifier } from '../lib/shared/enums/PlayerIdentifier';
import { GameType } from '../lib/shared/enums/gameType';
import { ApiService } from '../services/api.service';
import gameService from '../services/game.service';
import lingoService from '../services/lingo.service';
import socketService from '../services/socket.service';

@Component({
  selector: 'app-base-game',
  templateUrl: './base-game.component.html',
  styleUrls: ['./base-game.component.css']
})
export class BaseGameComponent implements OnInit {

  public gameType!: GameType;
  public statusMessage: string = 'Playing.';
  public isGameOver: boolean = false;
  public isGameStarted: boolean = false;
  public playerTurn: boolean = false;
  public isInRoom: boolean = false;
  public isRoomFull: boolean = false;
  public currentPlayer: PlayerIdentifier = PlayerIdentifier.EMPTY;

  private _apiService: ApiService;

  constructor(apiService: ApiService, gameType: GameType) {
    this.gameType = gameType;
    this._apiService = apiService;
  }

  async ngOnInit() {
    gameService.isInRoom.subscribe(inRoom => {
      this.isInRoom = inRoom;
      if (!this.isGameStarted && this.isInRoom) {
        this.statusMessage = 'Waiting for other player to join..';
      }
    });

    gameService.roomFull.subscribe(roomFull => {
      this.isRoomFull = roomFull;
      this.statusMessage = 'Waiting for host to start the game..'
    });
  }

  async ngAfterViewInit() {
    if (gameService.gameType.getValue() !== this.gameType) return;

    await gameService.onGameWin(socketService.socket!, (message: string) => {
      this.isGameOver = true;
      this.statusMessage = message;
    });
  }

  /**
   * Start game.
   */
  public startGame(): void {
    switch (this.gameType) {
      case GameType.TICTACTOE:
        gameService.gameType.next(GameType.TICTACTOE);
        gameService.startGame(socketService.socket!,
          { roomId: gameService.roomId.getValue(), gameType: this.gameType });
        break;
      case GameType.WORDGUESSER:
        gameService.gameType.next(GameType.WORDGUESSER);
        gameService.startGame(socketService.socket!,
          { roomId: gameService.roomId.getValue(), gameType: this.gameType, letterCount: lingoService.letterCount.getValue() });;
        break;
    }

  }

  /**
   * Set the player identifier (x or o)
   * @param playerIdentifier 
   */
  setCurrentPlayer(playerIdentifier: string): void {
    if (playerIdentifier === 'x') this.currentPlayer = PlayerIdentifier.X;
    if (playerIdentifier === 'o') this.currentPlayer = PlayerIdentifier.O;
  }

  /**
   * Determine who's the next player based of currentplayer.
   * @returns 
   */
  public deterMineNextPlayer(): PlayerIdentifier {
    var nextPlayer = PlayerIdentifier.EMPTY;
    if (this.currentPlayer === PlayerIdentifier.X) nextPlayer = PlayerIdentifier.O;
    if (this.currentPlayer === PlayerIdentifier.O) nextPlayer = PlayerIdentifier.X;

    return nextPlayer;
  }
}
