"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class NgrokConfigHandler {
    constructor(config) {
        this.config = config;
    }
    handle(expressRequest, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var result = yield axios_1.default.get(this.config.baseUrl + '/api/tunnels');
                console.log(result);
                res.json(result);
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });
    }
}
exports.NgrokConfigHandler = NgrokConfigHandler;
//# sourceMappingURL=ngrok_config_handler.js.map