"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const utility_1 = require("../src/utility/utility");
describe("Utility Tests", function () {
    describe("Whiteboard Name Recognition Tests", function () {
        it("recognizes whiteboard as a phrase", function () {
            var result = utility_1.Utility.isWhiteboard("whiteboard");
            chai_1.expect(result).to.equal(true);
        });
    });
    describe("Kitchen Cabinet Name Recognition Tests", function () {
        it("recognizes kitchen as a phrase", function () {
            var result = utility_1.Utility.isKitchen("kitchen");
            chai_1.expect(result).to.equal(true);
        });
    });
    describe("Side Table Name Recognition Tests", function () {
        it("recognizes side table as a phrase", function () {
            var result = utility_1.Utility.isSideTable("side table");
            chai_1.expect(result).to.equal(true);
        });
    });
});
//# sourceMappingURL=utility.spec.js.map