import { DeviceNames } from "../device/device";

export class Utility {

    static isWhiteboard(unprocessedName: string): boolean {
        return (unprocessedName === "the whiteboard" || unprocessedName === "whiteboard" || unprocessedName === "white board"
            || unprocessedName === "the lightboard" || unprocessedName === "lightboard" || unprocessedName === "light board"
            || unprocessedName === "light 1" || unprocessedName === "white boar" || unprocessedName === "light boar"
            || unprocessedName === "narwhale"
            || unprocessedName === "light ward" || unprocessedName === "white war" || unprocessedName === "light war");
    }

    static isKitchen(unprocessedName: string): boolean {
        return (unprocessedName == "kitchen" || unprocessedName == "the kitchen" || unprocessedName === "kitch light" || unprocessedName === "the kitchen light");
    }

    static isSideTable(unprocessedName: string): boolean {
        return (unprocessedName == "side table" || unprocessedName == "the side table");
    }
    
    public static unprocessedNameToDeviceName(unprocessedName: string): string {
        if (Utility.isWhiteboard(unprocessedName))
            return DeviceNames.whiteboard;
        else if (Utility.isKitchen(unprocessedName))
            return DeviceNames.kitchen;
        else if (Utility.isSideTable(unprocessedName))
            return DeviceNames.sideTable;

        return null;
    }

};

export interface IRepoConfig {
    repoPath: string;
};

export class Messages {
    public static StockErrorMessage: string = 'Sum ting wong!';
};

export interface ISystemConfig {
    messaging: any;
    build: any;
    deviceRepo: IRepoConfig;
    indicatorRepo: IRepoConfig;
    animationRepo: IRepoConfig;
};

export interface IExpressApp {

}