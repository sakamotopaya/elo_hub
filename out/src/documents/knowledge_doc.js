"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KnowledgeDoc {
    constructor() {
        this.items = [];
        this.originalDocument = [];
    }
}
exports.KnowledgeDoc = KnowledgeDoc;
;
;
class KnowledgeItemBase {
    constructor(itemType) {
        this.itemType = itemType;
    }
}
exports.KnowledgeItemBase = KnowledgeItemBase;
;
class SummaryItem extends KnowledgeItemBase {
    constructor(text) {
        super('summary');
        this.text = text;
    }
    ;
}
exports.SummaryItem = SummaryItem;
//# sourceMappingURL=knowledge_doc.js.map