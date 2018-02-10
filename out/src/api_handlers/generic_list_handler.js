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
class GenericListHandler {
    constructor(description, repo) {
        this.repo = repo;
        this.description = description;
    }
    handle(expressRequest, expressResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.description + ': ' + JSON.stringify(expressRequest.query));
            let items = this.repo.allItems();
            expressResponse.json(items);
        });
    }
}
exports.GenericListHandler = GenericListHandler;
;
//# sourceMappingURL=generic_list_handler.js.map