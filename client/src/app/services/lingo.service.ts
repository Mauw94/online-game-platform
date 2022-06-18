import { BehaviorSubject } from "rxjs";

class LingoService {
    public letterCount: BehaviorSubject<number> = new BehaviorSubject<number>(4);
}

export default new LingoService();