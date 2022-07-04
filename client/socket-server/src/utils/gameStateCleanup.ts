import { GameStateHandler } from "../gs/gameStateHandler";

class GameStateCleanUp {

    /**
     * Remove everything from the gamestate cache that's been there longer than 24 hours
     */
    public cleanUp(): void {
        console.log('doing some gamestate clean up..');

        var states = GameStateHandler.getStates();
        var dateNow = new Date();
        states.forEach((value, key) => {
            const msTimeBetween = Math.abs(value.startTime.getTime() - dateNow.getTime());
            const hTimeBetween = msTimeBetween / (60 * 60 * 1000);
            if (hTimeBetween >= 24)
                states.delete(key);
        });
    }
}

export default new GameStateCleanUp();