import { Component } from '@angular/core';
import { BaseGameComponent } from 'src/app/base-game/base-game.component';
import { ApiService } from 'src/app/services/api.service';
import lingoService from 'src/app/services/lingo.service';
import { GameType } from '../../lib/shared/enums/gameType';
import gameService from '../../services/game.service';
import socketService from '../../services/socket.service';

@Component({
  selector: 'app-lingo',
  templateUrl: './lingo.component.html',
  styleUrls: ['./lingo.component.css']
})
export class LingoComponent extends BaseGameComponent {

  public letterCount: number = 4;

  constructor(private apiService: ApiService) {
    super(apiService, GameType.WORDGUESSER);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    if (socketService.socket) {
      gameService.onStartGame(socketService.socket, (options) => {
        super.isGameStarted = true;
        this.playerTurn = options.start;
        this.statusMessage = "Game on!";
      });
    }
  }

  /**
   * Send update of the lettercount to the service.
   */
  updateLetterCount(): void {
    lingoService.letterCount.next(this.letterCount);
  }

  /**
   * Go for a new word guess.
   */
  guess(): void {
    if (!this.playerTurn) return;
  }
}
