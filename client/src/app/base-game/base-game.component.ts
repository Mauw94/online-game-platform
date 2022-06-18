import { Component, OnInit } from '@angular/core';
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

  private _apiService: ApiService;

  constructor(apiService: ApiService, gameType: GameType) {
    this.gameType = gameType;
    this._apiService = apiService;
  }

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    gameService.onGameWin(socketService.socket!, (message: string) => {
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
        gameService.startGame(socketService.socket!,
          { roomId: gameService.roomId.getValue(), gameType: this.gameType });
        break;
      case GameType.WORDGUESSER:
        gameService.startGame(socketService.socket!,
          { roomId: gameService.roomId.getValue(), gameType: this.gameType, letterCount: lingoService.letterCount.getValue() });;
        break;
    }

  }
}