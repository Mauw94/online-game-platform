import { Server } from 'socket.io';
import { useSocketServer } from 'socket-controllers';
import { MainController } from './controllers/mainController';

export default (httpServer: any) => {
    const io = new Server(httpServer, { cors: { origin: "*" } });

    // io.on('connection', (socket) => {
    //     console.log('connected', socket.id);
    // });

    useSocketServer(io, { controllers: [__dirname + '/controllers/*.ts'] });
    
    return io;
};