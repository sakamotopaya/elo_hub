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
class ExpenseQueryIntentHandler {
    constructor(logger, config) {
        this.logger = logger;
        this.config = config;
    }
    handleIntent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let that = this;
            return new Promise((resolve, reject) => {
                console.log('expense query...');
                var category = that.getExpenseCategory(request.slot("category"));
                if (category) {
                    var amount = that.getAmount(category);
                    var commonPhrase = this.getCommonPhrase(category);
                    var phrase = 'This month, you have spent ' + amount + ' dollars on ' + commonPhrase;
                    response.say(phrase);
                }
                else
                    response.say("I dont know about " + request.slot("category"));
                resolve(response);
            });
        });
    }
    getCommonPhrase(expenseCategory) {
        let index = {};
        index['grocery'] = 'groceries';
        index['utility'] = 'utilities';
        var phrase = index[expenseCategory];
        if (!phrase)
            phrase = expenseCategory;
        return phrase;
    }
    getAmount(expenseCategory) {
        let index = {};
        index['household'] = 400;
        index['technology'] = 300;
        index['utility'] = 330;
        index['automotive'] = 550;
        index['insurance'] = 300;
        return index[expenseCategory];
    }
    getExpenseCategory(category) {
        var index = {};
        index['groceries'] = 'household';
        index['food'] = 'household';
        index['household'] = 'household';
        index['electronics'] = 'technology';
        index['technology'] = 'technology';
        index['utilities'] = 'utility';
        index['internet'] = 'utility';
        index['phone'] = 'utility';
        index['automotive'] = 'automotive';
        index['fuel'] = 'automotive';
        index['oil_change'] = 'automotive';
        index['insurance'] = 'insurance';
        index['car_insurance'] = 'insurance';
        index['insurance'] = 'insurance';
        var sanitized = category.replace(' ', '_').replace("'", '');
        return index[sanitized];
    }
}
exports.ExpenseQueryIntentHandler = ExpenseQueryIntentHandler;
//# sourceMappingURL=expense_query_intent.js.map