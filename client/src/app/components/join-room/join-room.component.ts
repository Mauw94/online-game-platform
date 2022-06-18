import { Component, Input, OnInit } from '@angular/core';
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

  @Input()
  gameType!: GameType;

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

    const joined = await gameService.joinGameRoom(socket, this.roomName, this.gameType).catch((err) => {
      alert(err);
    });

    if (joined) {
      gameService.isInRoom.next(true);
      gameService.roomId.next(this.roomName);
    }
    this.isJoining = false;
  }
}
