import * as Bluebird from "bluebird";

export class Utils {
    public static PromiseLoop(condition: () => boolean, action: () => Bluebird<any>): Bluebird<any> {
        let loop = () => {
            if (condition()) {
                return;
            }
            return Bluebird.resolve(action()).then(loop).catch(loop);
        };
        return Bluebird.resolve().then(loop);
    }
    public static PromiseLoopWithCatch(condition: () => boolean, action: () => Bluebird<any>): Bluebird<any> {
        let loop = () => {
            if (condition()) {
                return;
            }
            return Bluebird.resolve(action()).then(loop);
        };
        return Bluebird.resolve().then(loop);
    }
}

export default Utils;
