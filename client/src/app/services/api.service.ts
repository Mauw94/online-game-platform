import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GameType } from "../lib/shared/enums/gameType";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl: string;

    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl + 'game';
    }

    /**
     * Start a new game.
     * @param gameType The game type.
     */
    public startGame(gameType: GameType): Observable<any> {
        return this.http.post(`${this.baseUrl}/start`, gameType);
    }

    /**
     * End a game.
     * @param gameId 
     * @returns 
     */
    public endGame(gameId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/end?id=${gameId}`);
    }
}