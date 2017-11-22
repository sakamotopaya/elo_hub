import * as mocha from 'mocha';
import { expect } from 'chai';
import { container } from "../boot";

import { Utility } from "../../src/utility/utility";
import { StaticDeviceRepo } from '../../src/device/device_repo';
import { DeviceNames } from '../../src/device/device';

describe("Device Repo Tests", function () {
    describe("Static Device Repo Tests", function () {
        describe("Can retrieve a device", function () {
            it("retrieves the whiteboard device", function () {

                var repo = new StaticDeviceRepo();
                var result = repo.getDeviceByName(DeviceNames.whiteboard);

                expect(result).to.not.be.null;
            }), 
            it("bad device names return null", function () {

                var repo = new StaticDeviceRepo();
                var result = repo.getDeviceByName('junk');

                expect(result).to.be.null;
            });
        });
    });
});