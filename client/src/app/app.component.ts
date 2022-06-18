import { Component, OnInit } from '@angular/core';
import socketService from './services/socket.service';
@Component({

  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit() {
    if (!socketService.socket) {
      socketService.connect('http://localhost:9000');
    }
  }
}
