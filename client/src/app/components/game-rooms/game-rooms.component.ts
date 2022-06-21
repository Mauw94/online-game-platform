import { Component, OnInit } from '@angular/core';
import gameService from 'src/app/services/game.service';
import gameroomService from 'src/app/services/gameroom.service';
import socketService from 'src/app/services/socket.service';

@Component({
  selector: 'app-game-rooms',
  templateUrl: './game-rooms.component.html',
  styleUrls: ['./game-rooms.component.scss']
})
export class GameRoomsComponent implements OnInit {

  public isConnected: boolean = false;
  public isInRoom: boolean = false;
  public roomId: string | undefined;
  public availableRooms: string[] = [];

  constructor() { }

  async ngOnInit() {
    socketService.connected.subscribe((connected: boolean) => {
      this.isConnected = connected;
    });
    gameService.isInRoom.subscribe((inRoom: boolean) => {
      this.isInRoom = inRoom;
    });
    gameService.roomId.subscribe((roomId: string | undefined) => {
      this.roomId = roomId;
    });
  }

  async ngAfterViewInit() {
    if (socketService.socket) {
      await this.getAllAvailableRooms();

      await gameroomService.onGetAllAvailableRooms(socketService.socket, (availableRooms) => {
        this.availableRooms = availableRooms;
      });
    }
  }

  /**
   * Leave current game room.
   */
  async leaveCurrentRoom(): Promise<void> {
    if (socketService.socket && gameService.roomId.getValue() !== undefined) {
      const leftRoom = await gameService.leaveGameRoom(socketService.socket, gameService.roomId.getValue()!);
      if (leftRoom) {
        gameService.isInRoom.next(false);
        gameService.roomId.next(undefined);
        await this.getAllAvailableRooms();
      }
    }
  }

  /**
   * Leaves the current room and create a new room.
   */
  async createNewRoom(): Promise<void> {
    await this.leaveCurrentRoom();
  }

  /**
   * Join a game room.
   * @param roomId 
   */
  async joinRoom(roomId: string): Promise<void> {
    if (socketService.socket) {
      const left = await gameService.leaveGameRoom(socketService.socket, this.roomId!); // this.roomId is the roomId of the current players room
      if (left) {
        const joined = await gameService.joinGameRoom(socketService.socket, roomId);
        if (joined) {
          gameService.isInRoom.next(true);
          gameService.roomId.next(roomId);
        }
      }
    }
  }

  /**
   * Emit event to get all the available rooms.
   */
  private async getAllAvailableRooms(): Promise<void> {
    await gameroomService.getAllAvailableRooms(socketService.socket!).catch((err) => {
      alert(err);
    });
  }
}
