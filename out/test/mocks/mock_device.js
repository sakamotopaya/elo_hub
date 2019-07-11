"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockDevice {
    constructor() {
        this.deviceState = new DeviceState();
    }
    setOn() {
        throw new Error("Method not implemented.");
    }
    setOff() {
        throw new Error("Method not implemented.");
    }
    updateIndicator(indicatorId, state, level) {
        var self = this;
        return new Promise((resolve, reject) => {
            this.deviceState.index = indicatorId;
            this.deviceState.state = state;
            this.deviceState.level = level;
        });
    }
}
exports.MockDevice = MockDevice;
class DeviceState {
}
//# sourceMappingURL=mock_device.js.map