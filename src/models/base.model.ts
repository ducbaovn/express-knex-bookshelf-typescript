import * as _ from "lodash";
import * as momentTz from "moment-timezone";

export class BaseModel {
    public id: string = undefined;
    public createdDate: momentTz.Moment = undefined;
    public updatedDate: momentTz.Moment = undefined;
    public isDeleted: boolean = undefined;
    public isEnable: boolean = undefined;

    public static hasValue(val: any): boolean {
        return !_.isNull(val) && !_.isEmpty(val);
    }

    public static toJSON(val: any): string {
        return JSON.stringify(val);
    }

    public static fromJSON<T>(val: string, defaultVal: T = undefined): T {
        try {
            let ret = JSON.parse(val);
            return ret as T;
        }
        catch (err) {
            return defaultVal;
        }
    }

    public static getTimeInterval(val: any, defaultVal: Date = undefined): momentTz.Moment {
        let date: momentTz.Moment;
        if (defaultVal != null) {
            date = momentTz(defaultVal, "HH:mm:ss");
        }
        if (_.isString(val)) {
            date = momentTz(val, "HH:mm:ss");
        } else if (_.isDate(val)) {
            date = momentTz(val, "HH:mm:ss");
        }
        return date;
    }

    public static getDate(val: any, defaultVal: Date = undefined): momentTz.Moment {
        let date: momentTz.Moment;
        if (defaultVal != null) {
            date = momentTz.tz(defaultVal, "UTC");
        }
        if (_.isDate(val)) {
            date = momentTz.tz(val, "UTC");
        }
        else if (val != null) {
            date = momentTz.tz(new Date(val), "UTC");
        } else {
            date = val;
        }
        return date;
    }

    public static getString(val: any, defaultVal?: string): string {
        return (val != null && _.isString(val)) ? val : defaultVal != null ? defaultVal : undefined;
    }

    public static getArrayString(val: string[], defaultVal?: string[]): string[] {
        return (val != null && _.isArray(val)) ? val : defaultVal != null ? defaultVal : undefined;
    }

    public static getArrayNumber(val: number[], defaultVal?: number[]): number[] {
        return (val != null && _.isArray(val)) ? val : defaultVal != null ? defaultVal : undefined;
    }

    public static getArrayObject(val: object[], defaultVal?: object[]): object[] {
        return (val != null && _.isArray(val)) ? val : defaultVal != null ? defaultVal : undefined;
    }

    public static getBoolean(val: any, defaultVal?: boolean): boolean {
        if (val != null) {
            if (typeof (val) === "string") {
                val = val.toLowerCase();
            }
            switch (val) {
                case true:
                case 1:
                case "yes":
                case "right":
                case "true":
                case "1":
                    return true;
                default:
                    return false;
            }
        }
        return defaultVal;
    }

    public static getNumber(val: any, defaultVal: number = 0): number {
        if (val != null) {
            let num = Number(val);
            return isNaN(val) ? defaultVal : num;
        }
        return defaultVal;
    }

    public static filter(val: any, filters: string[] = []): void {
        if (val != null) {
            filters.forEach(field => {
                if (val.hasOwnProperty(field)) {
                    val[field] = undefined;
                }
            });
        }
    }
}

export default BaseModel;
