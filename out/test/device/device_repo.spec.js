"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const device_repo_1 = require("../../src/device/device_repo");
const device_1 = require("../../src/device/device");
const logger_1 = require("../../src/logger");
var config = {
    featureSet: { vsts: false, build: false, wiki: false, jenkins: false },
    messaging: {
        hubUrl: 'mqtt://pi3_hub',
        listenerDisabled: false,
        listenerPattern: 'elo/#'
    },
    elasticSearch: {
        url: "localhost:9200",
        logLevel: "trace",
        index: "test"
    },
    deviceRepo: {
        repoPath: 'sample_files'
    },
    indicatorRepo: {
        repoPath: 'sample_files'
    },
    animationRepo: {
        repoPath: 'sample_files'
    },
    registerMapRepo: {
        repoPath: 'sample_files'
    },
    broadcastInterval: 5000,
    vsts: { scriptPath: "", dataPath: "", token: "", vstsPath: "", activeTasksQueryId: "" },
    knowledgeDoc: { repoRoot: "" }
};
describe("Device Repo Tests", function () {
    describe("Static Device Repo Tests", function () {
        describe("Can retrieve a device", function () {
            it("retrieves the whiteboard device", function () {
                var repo = new device_repo_1.StaticDeviceRepo(new logger_1.ConsoleLogger(), config);
                var result = repo.getDeviceByName(device_1.DeviceNames.whiteboard);
                chai_1.expect(result).to.not.be.null;
            }),
                it("bad device names return null", function () {
                    var repo = new device_repo_1.StaticDeviceRepo(new logger_1.ConsoleLogger(), config);
                    var result = repo.getDeviceByName('junk');
                    chai_1.expect(result).to.be.null;
                });
        });
    });
});
//# sourceMappingURL=device_repo.spec.js.map