"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = require("../device/device");
class Utility {
    static isWhiteboard(unprocessedName) {
        return (unprocessedName === "the whiteboard" || unprocessedName === "whiteboard" || unprocessedName === "white board"
            || unprocessedName === "the lightboard" || unprocessedName === "lightboard" || unprocessedName === "light board"
            || unprocessedName === "light 1" || unprocessedName === "white boar" || unprocessedName === "light boar"
            || unprocessedName === "narwhale"
            || unprocessedName === "light ward" || unprocessedName === "white war" || unprocessedName === "light war");
    }
    static isKitchen(unprocessedName) {
        return (unprocessedName == "kitchen" || unprocessedName == "the kitchen" || unprocessedName === "kitch light" || unprocessedName === "the kitchen light");
    }
    static isSideTable(unprocessedName) {
        return (unprocessedName == "side table" || unprocessedName == "the side table");
    }
    static unprocessedNameToDeviceName(unprocessedName) {
        if (Utility.isWhiteboard(unprocessedName))
            return device_1.DeviceNames.whiteboard;
        else if (Utility.isKitchen(unprocessedName))
            return device_1.DeviceNames.kitchen;
        else if (Utility.isSideTable(unprocessedName))
            return device_1.DeviceNames.sideTable;
        return null;
    }
}
exports.Utility = Utility;
;
;
;
;
class Messages {
}
Messages.StockErrorMessage = 'Sum ting wong!';
exports.Messages = Messages;
;
;
//# sourceMappingURL=utility.js.map