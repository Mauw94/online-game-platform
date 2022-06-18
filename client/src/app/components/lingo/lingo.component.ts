import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseGameComponent } from 'src/app/base-game/base-game.component';
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
  character: string;
}

@Component({
  selector: 'app-lingo',
  templateUrl: './lingo.component.html',
  styleUrls: ['./lingo.component.css']
})
export class LingoComponent extends BaseGameComponent {

  public letterCount: number = 4;
  public inputTextLength: number = 4;
  public gameForm!: FormGroup;
  public matchingLetters: MatchingLetters[] = [];

  private wordToGuess: string = '';
  private guessedWordsHistory: string[] = [];

  constructor(private apiService: ApiService) {
    super(apiService, GameType.WORDGUESSER);
  }

  async ngOnInit() {
    super.ngOnInit();
    this.statusMessage = '';

    console.log(this.isGameStarted);
    console.log(this.isRoomFull);
  }

  async ngAfterViewInit() {
    if (socketService.socket) {
      super.ngAfterViewInit();

      await gameService.onStartGame(socketService.socket, (options) => {
        super.isGameStarted = true;
        this.wordToGuess = options.wordToGuess;
        this.playerTurn = options.start;
        this.inputTextLength = this.wordToGuess?.length;
        this.statusMessage = 'Have fun';
      });

      this.gameForm = new FormGroup({
        word: new FormControl('', [
          Validators.required,
          Validators.minLength(this.inputTextLength),
          Validators.maxLength(this.inputTextLength)])
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
    console.log(this.playerTurn);
    if (!this.playerTurn) return;

    var word = this.gameForm!.controls.word.value;
    this.guessedWordsHistory.push(word);
    this.gameForm!.controls.word.setValue('');

    this.checkValidLetters();

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
        letter.character = wordChars[j];
        letterWord.push(letter);
      }
      this.matchingLetters.push({ word: letterWord });

      this.guessedWordsHistory.shift();
      i--;
    }
  }
}
