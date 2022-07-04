import { GameType } from "../lib/shared/enums/gameType";

export interface GameState {
    startTime: Date;
    gameType: GameType;
    started: boolean;
    playerToPlay: string;
    state: any;
    players: string[];
}