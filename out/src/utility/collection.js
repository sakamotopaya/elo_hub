"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Collection {
    constructor() {
        // The underlying array data structure of the collection
        this._items = [];
    }
    // Get the collection as an array
    getItems() {
        return this._items;
    }
    // Get a specific item from a collection given it's index
    getItem(index) {
        return this._items[index];
    }
    // Length of the collection
    count() { return this._items.length; }
    // Add an object to the collection
    add(item) {
        this._items.push(item);
    }
    // Delete an object from the collection
    delete(itemIndex) {
        this._items.splice(itemIndex, 1);
    }
    // Find the index of a given object in a collection
    indexOfItem(obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = 0;
        }
        else if (fromIndex < 0) {
            fromIndex = Math.max(0, this._items.length + fromIndex);
        }
        for (var i = fromIndex, j = this._items.length; i < j; i++) {
            if (this._items[i] === obj)
                return i;
        }
        return -1;
    }
}
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map