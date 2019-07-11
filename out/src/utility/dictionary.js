"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyedCollection {
    constructor() {
        this.items = {};
        this.itemCount = 0;
    }
    containsKey(key) {
        return this.items.hasOwnProperty(key);
    }
    count() {
        return this.itemCount;
    }
    add(key, value) {
        if (!this.items.hasOwnProperty(key))
            this.itemCount++;
        this.items[key] = value;
    }
    remove(key) {
        var val = this.items[key];
        delete this.items[key];
        this.itemCount--;
        return val;
    }
    item(key) {
        return this.items[key];
    }
    keys() {
        var keySet = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
    }
    values() {
        var values = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
        return values;
    }
}
exports.KeyedCollection = KeyedCollection;
//# sourceMappingURL=dictionary.js.map