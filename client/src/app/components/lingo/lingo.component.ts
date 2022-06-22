import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseGameComponent } from 'src/app/base-game/base-game.component';
import { PlayerIdentifier } from 'src/app/lib/shared/enums/PlayerIdentifier';
import { ApiService } from 'src/app/services/api.service';
import lingoService from 'src/app/services/lingo.service';
import { GameType } from '../../lib/shared/enums/gameType';
import gameService from '../../services/game.service';
import socketService from '../../services/socket.service';

export interface MatchingLetters {
  word: Letter[];
}

export interface Letter {
  match: boolean;
  contains: boolean;
  character: string;
}

@Component({
  selector: 'app-lingo',
  templateUrl: './lingo.component.html',
  styleUrls: ['./lingo.component.css']
})
export class LingoComponent extends BaseGameComponent {

  public letterCount: number = 4;
  public gameForm!: FormGroup;
  public matchingLetters: MatchingLetters[] = [];
  public wordToGuess: string = '';
  public wordToGuessLength: number | undefined;

  private guessedWordsHistory: string[] = [];

  constructor(private apiService: ApiService) {
    super(apiService, GameType.WORDGUESSER);
  }

  async ngOnInit() {
    lingoService.letterCount.next(this.letterCount);
    super.ngOnInit();
  }

  async ngAfterViewInit() {
    if (socketService.socket) {
      super.ngAfterViewInit();

      await gameService.onStartGame(socketService.socket, (options) => {
        console.log(options);
        if (options.game !== 'lingo') return;

        console.log(options.wordToGuess);
        this.matchingLetters = [];
        this.guessedWordsHistory = [];
        super.isGameStarted = true;
        this.wordToGuess = options.wordToGuess;
        this.wordToGuessLength = this.wordToGuess.length;

        this.setCurrentPlayer(options.symbol);
        if (options.start) { this.playerTurn = true; } else { this.playerTurn = false; }

        this.statusMessage = this.playerTurn ? 'Your turn' : 'Opponent\'s turn';
      });

      this.gameForm = new FormGroup({
        word: new FormControl('', [
          Validators.required
          // Validators.minLength(this.wordToGuess.length),
          // Validators.maxLength(this.wordToGuess.length)
        ])
      });

      await gameService.onGameUpdate(socketService.socket, (gameState, playerToPlay) => {
        if (this.currentPlayer === playerToPlay) {
          this.playerTurn = true;
        } else {
          this.playerTurn = false;
        }

        this.matchingLetters = gameState;
        this.statusMessage = this.playerTurn ? 'Your turn' : 'Opponent\'s turn';
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

    var word = this.gameForm!.controls.word.value;
    this.guessedWordsHistory.push(word);
    this.gameForm!.controls.word.setValue('');

    this.checkValidLetters();

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, this.matchingLetters, this.deterMineNextPlayer());
    }
  }

  /**
  * Check valid and matching letters in a word.
  */
  private checkValidLetters(): void {
    var letterWord: Letter[] = [];
    var wordToGuessChars = this.wordToGuess!.split('');

    for (let i = 0; i < this.guessedWordsHistory.length; i++) {
      var word = this.guessedWordsHistory[i].toUpperCase();
      var wordChars = word.split('');
      letterWord = [];

      for (let j = 0; j < wordChars.length; j++) {
        var letter: Letter = {} as Letter;
        if (wordToGuessChars[j] === wordChars[j]) letter.match = true;
        if (wordToGuessChars.includes(wordChars[j])) letter.contains = true;
        letter.character = wordChars[j];
        letterWord.push(letter);
      }
      this.matchingLetters.push({ word: letterWord });

      this.guessedWordsHistory.shift();
      i--;
    }
  }
}
