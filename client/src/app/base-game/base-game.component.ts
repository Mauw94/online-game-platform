import { Component, HostListener, OnInit } from '@angular/core';
import { PlayerIdentifier } from '../lib/shared/enums/PlayerIdentifier';
import { GameType } from '../lib/shared/enums/gameType';
import { ApiService } from '../services/api.service';
import gameService from '../services/game.service';
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
    });
  }

  async ngAfterViewInit() {
    await gameService.onGameWin(socketService.socket!, (message: string) => {
      this.isGameOver = true;
      this.statusMessage = message;
    });
  }

  /**
   * Unload component.
   */
  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Cleared');
  }

  /**
   * Start game.
   */
  public startGame(): void {
    switch (this.gameType) {
      case GameType.TICTACTOE:
        gameService.gameType.next(GameType.TICTACTOE);
        break;
      case GameType.WORDGUESSER:
        gameService.gameType.next(GameType.WORDGUESSER);
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
  deterMineNextPlayer(): PlayerIdentifier {
    var nextPlayer = PlayerIdentifier.EMPTY;
    if (this.currentPlayer === PlayerIdentifier.X) nextPlayer = PlayerIdentifier.O;
    if (this.currentPlayer === PlayerIdentifier.O) nextPlayer = PlayerIdentifier.X;

    return nextPlayer;
  }

  /**
   * Emit check the game room state.
   * if both players are on the game page, the game starts
   * @param message 
   */
  async checkGameRoomState(message: any) {
    await gameService.checkGameRoomState(socketService.socket!, message);
  }
}
