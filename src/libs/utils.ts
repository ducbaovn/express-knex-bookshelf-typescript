import * as Bluebird from "bluebird";
import * as bcrypt from "bcrypt";

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
    public static hashPassword(password: string): Bluebird<string> {
        return bcrypt.hash(password, 10);
    }
    public static compareHash(password: string, hash: string): Bluebird<boolean> {
        return Bluebird.resolve()
        .then(() => {
            if (password == null || hash == null) {
                return false;
            }
            return bcrypt.compare(password, hash);
        });
    }
}

export default Utils;
