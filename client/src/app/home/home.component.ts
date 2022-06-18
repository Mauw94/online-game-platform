import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthorizeService } from 'src/api-authorization/authorize.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

  public authenticated: boolean = true;
  public isInRoom: boolean = false;
  public roomId: string | undefined;

  constructor(
    private apiService: ApiService,
    //private authService: AuthorizeService,
    private router: Router) { }

  ngOnInit() {
    // TODO: enable again later.
    // this.authService.isAuthenticated().subscribe(authenticated => {
    //   this.authenticated = authenticated;
    // });
  }

  /**
   * Start playing word guesser.
   */
  playWordGuesser(): void {
    this.router.navigate(['/lingo']);
  }

  /**
   * Start playing Tic Tac Toe.
   */
  playTicTacToe(): void {
    this.router.navigate(['/tictactoe']);
  }
}
