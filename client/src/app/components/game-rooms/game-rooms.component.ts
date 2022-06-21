import { Component, OnInit } from '@angular/core';
import gameroomService from 'src/app/services/gameroom.service';
import socketService from 'src/app/services/socket.service';

@Component({
  selector: 'app-game-rooms',
  templateUrl: './game-rooms.component.html',
  styleUrls: ['./game-rooms.component.scss']
})
export class GameRoomsComponent implements OnInit {

  constructor() { }

  async ngOnInit() {
    if (socketService.socket) {
      const roomId = await gameroomService.currentGameRoom(socketService.socket);
      console.log(roomId);
    }
  }

  /**
   * Leave current game room.
   */
  LeaveCurrentRoom(): void {

  }
}
