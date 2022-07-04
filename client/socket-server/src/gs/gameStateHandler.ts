import { GameState } from "./gameState";

export class GameStateHandler {

    private static gameStates: Map<string, GameState> = new Map<string, GameState>(); // key = room id, value = game state

    /**
     * Get all the states.
     * @returns 
     */
    public static getStates(): Map<string, GameState> {
        return this.gameStates;
    }

    /**
     * Get specific state for a gameroom.
     * @param gameRoom 
     * @returns 
     */
    public static getState(gameRoom: string): GameState {
        return this.gameStates.get(gameRoom);
    }

    /**
     * Set a state.
     * @param gameRoom 
     * @param gameState 
     */
    public static setState(gameRoom: string, gameState: GameState): void {
        this.gameStates.set(gameRoom, gameState);
    }

    /**
     * Delete a state.
     * @param gameRoom 
     */
    public static deleteState(gameRoom: string): void {
        this.gameStates.delete(gameRoom);
    }
}