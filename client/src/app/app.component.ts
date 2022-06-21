import { Component, OnInit } from '@angular/core';
import gameService from './services/game.service';
import socketService from './services/socket.service';
@Component({

  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  public isInRoom: boolean = false;

  ngOnInit() {
    gameService.isInRoom.subscribe((inRoom: boolean) => {
      this.isInRoom = inRoom;
    });
    
    if (!socketService.socket) {
      socketService.connect('http://localhost:9000');
      socketService.connected.next(true);
    }
  }
}
