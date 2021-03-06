import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { LingoComponent } from './components/lingo/lingo.component';
import TictactoeComponent from './components/tictactoe/tictactoe.component';
import { CellComponent } from './components/tictactoe/cell/cell.component';
import { JoinRoomComponent } from './components/join-room/join-room.component';
import { BaseGameComponent } from './base-game/base-game.component';
import { GameRoomsComponent } from './components/game-rooms/game-rooms.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { RoomGuard } from './guards/room.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LingoComponent,
    TictactoeComponent,
    CellComponent,
    JoinRoomComponent,
    BaseGameComponent,
    GameRoomsComponent,
    ChatRoomComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'lingo', component: LingoComponent, canActivate: [RoomGuard] },
      { path: 'tictactoe', component: TictactoeComponent, canActivate: [RoomGuard] }
    ])
  ],
  providers: [
    //{ provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
