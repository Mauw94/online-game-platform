import { BehaviorSubject } from "rxjs";

class LingoService {
    // Used to store the lettercount selection when starting the game
    public letterCount: BehaviorSubject<number> = new BehaviorSubject<number>(4);
}

export default new LingoService();