import { Component, OnInit } from '@angular/core';
import { GameType } from '../../lib/shared/enums/gameType';
import gameService from '../../services/game.service';
import socketService from '../../services/socket.service';
import { PlayerIdentifier } from '../../lib/shared/enums/PlayerIdentifier';
import { BaseGameComponent } from 'src/app/base-game/base-game.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.scss']
})
export default class TictactoeComponent extends BaseGameComponent {

  public board: PlayerIdentifier[][] = [];

  constructor(private apiService: ApiService) {
    super(apiService, GameType.TICTACTOE);
  }

  async ngOnInit() {
    super.ngOnInit();
    this.statusMessage = '';
  }

  async ngAfterViewInit() {
    if (socketService.socket) {
      super.ngAfterViewInit();

      // game starts, set initial values
      await gameService.onStartGame(socketService.socket, (options) => {
        this.isGameStarted = true;
        this.setCurrentPlayer(options.symbol);
        if (options.start) { this.playerTurn = true; } else { this.playerTurn = false; }

        gameService.playerToPlay.next(this.currentPlayer);

        this.newGame();
      });

      // game updates, set the gamestate and player to play
      await gameService.onGameUpdate(socketService.socket, (gameState, playerToPlay) => {
        this.board = gameState;
        if (!this.isGameOver) {
          if (this.currentPlayer === playerToPlay) {
            this.playerTurn = true;
          } else {
            this.playerTurn = false;
          }
          this.statusMessage = this.playerTurn ? 'Your turn' : 'Opponent\'s turn';
        }
      });

      // when player left the game screen and comes back to a game in progress, get the gamestate, playertoplay states from the server.
      await gameService.checkGameProgress(socketService.socket!, (gameStarted, playerToPlay, gameState) => {
        this.isGameStarted = gameStarted;
        this.currentPlayer = gameService.playerToPlay.getValue();
        if (gameService.playerToPlay.getValue() === playerToPlay) {
          this.playerTurn = true;
        } else {
          this.playerTurn = false;
        }

        this.board = gameState;
      });
    }
  }

  /**
   * Player set an X or O in the game.
   * @param row 
   * @param col 
   */
  move(row: number, col: number): void {
    if (!this.playerTurn) return;
    if (this.board[row][col] !== PlayerIdentifier.EMPTY) return;

    if (!this.isGameOver && this.board[row][col] === PlayerIdentifier.EMPTY) {
      this.board[row][col] = this.currentPlayer;
      if (this.isDraw()) {
        this.isGameOver = true;
        this.gameDrawMessage();
      } else if (this.isWin()) {
        this.isGameOver = true;
        this.gameWinMessage();
      }
    }

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, this.board, this.deterMineNextPlayer());
    }
  }

  /**
   * Check for a draw.
   */
  isDraw(): boolean {
    for (const colums of this.board) {
      for (const col of colums) {
        if (col == PlayerIdentifier.EMPTY) {
          return false;
        }
      }
    }
    return !this.isWin();
  }

  /**
   * Check for a win.
   */
  isWin(): boolean {
    // Horizontal
    for (const columns of this.board) {
      if (columns[0] === columns[1] && columns[0] === columns[2] && columns[0] !== PlayerIdentifier.EMPTY) {
        return true;
      }
    }

    // Vertical
    for (let col = 0; col < this.board[0].length; col++) {
      if (
        this.board[0][col] === this.board[1][col] &&
        this.board[0][col] === this.board[2][col] &&
        this.board[0][col] !== PlayerIdentifier.EMPTY
      ) {
        return true;
      }
    }

    // Diagonals
    if (
      this.board[0][0] === this.board[1][1] &&
      this.board[0][0] === this.board[2][2] &&
      this.board[0][0] !== PlayerIdentifier.EMPTY
    ) {
      return true;
    }

    if (
      this.board[0][2] === this.board[1][1] &&
      this.board[0][2] === this.board[2][0] &&
      this.board[0][2] !== PlayerIdentifier.EMPTY
    ) {
      return true;
    }

    return false;
  }

  /**
   * Start a new game.
   */
  newGame(): void {
    this.board = [];
    for (let row = 0; row < 3; row++) {
      this.board[row] = [];
      for (let col = 0; col < 3; col++) {
        this.board[row][col] = PlayerIdentifier.EMPTY;
      }
    }

    this.isGameOver = false;
    this.statusMessage = this.playerTurn ? 'Your turn' : 'Opponent\'s turn';
  }

  /**
   * Restart the game.
   */
  async restart(): Promise<void> {
    await gameService.restartGame(socketService.socket!, gameService.roomId.getValue()!, GameType.TICTACTOE);
  }

  /**
   * Show game win message, send event to server to update player lost.
   */
  private gameWinMessage(): void {
    gameService.gameWin(socketService.socket!, 'You lost..');
    this.statusMessage = 'You won!';
  }

  /**
   * Game ends in a draw.
   */
  private gameDrawMessage(): void {
    gameService.gameWin(socketService.socket!, 'It\'s a draw.');
    this.statusMessage = 'It\'s a draw.';
  }
}
