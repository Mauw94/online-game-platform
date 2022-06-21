import { Component, Input, OnInit } from '@angular/core';
import gameroomService from 'src/app/services/gameroom.service';
import { GameType } from '../../lib/shared/enums/gameType';
import gameService from '../../services/game.service';
import socketService from '../../services/socket.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent implements OnInit {
  public roomName: string | undefined;
  public isJoining: boolean = false;

  constructor() { }

  async ngOnInit() {
    await gameService.listenToRoomFull(socketService.socket!, (options: any) => {
      gameService.roomFull.next(true);
    });
  }

  /**
  * Join a game room.
  */
  async joinRoom(): Promise<void> {
    const socket = socketService.socket;
    if (!this.roomName || this.roomName.trim() === '' || !socket) return;
    this.isJoining = true;

    const joined = await gameService.joinGameRoom(socket, this.roomName).catch((err) => {
      alert(err);
    });


    // TODO: remove this after testing
    gameroomService.getAllAvailableRooms(socket);

    if (joined) {
      gameService.isInRoom.next(true);
      gameService.roomId.next(this.roomName);
    }
    this.isJoining = false;
  }
}
