"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VstsWorkitem {
}
exports.VstsWorkitem = VstsWorkitem;
;
class VstsUtilities {
    static getCompletedWork(item) {
        if (item.fields && item.fields["Microsoft.VSTS.Scheduling.CompletedWork"])
            return item.fields["Microsoft.VSTS.Scheduling.CompletedWork"];
        return 0;
    }
    static getOriginalEstimate(item) {
        if (item.fields && item.fields["Microsoft.VSTS.Scheduling.OriginalEstimate"])
            return item.fields["Microsoft.VSTS.Scheduling.OriginalEstimate"];
        return 0;
    }
    static getRemainingWork(item) {
        if (item.fields && item.fields["Microsoft.VSTS.Scheduling.RemainingWork"])
            return item.fields["Microsoft.VSTS.Scheduling.RemainingWork"];
        return 0;
    }
    static getState(item) {
        if (item.fields && item.fields["System.State"])
            return item.fields["System.State"];
        return "unknown";
    }
    static getTitle(item) {
        if (item.fields && item.fields["System.Title"])
            return item.fields["System.Title"];
        return "unknown";
    }
}
exports.VstsUtilities = VstsUtilities;
;
//# sourceMappingURL=vsts.js.map