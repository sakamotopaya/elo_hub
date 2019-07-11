var SerialPort = require('serialport').SerialPort;
const Readline = SerialPort.parsers.Readline;
var config = {
    serialPort: "/dev/tty.SLAB_USBtoUART",
    baudRate: 19200
};
var testCommands = [
    {
        description: "Turn the device on",
        command: "1,123456;",
        expectedResult: "123456,1,50,255,255,255,0,0,0,0,0,0,1"
    }
];
class SerialDeviceTester {
    testDevice(deviceConfig) {
        const parser = new Readline();
        var serialPort = new SerialPort(deviceConfig.serialPort, { baudRate: deviceConfig.baudRate });
        serialPort.pipe(parser);
        serialPort.on('error', function (err) {
            console.log('Error: ', err.message);
        });
        parser.on('data', (data) => {
            console.log(data);
        });
        serialPort.write('1,123456;\r\n', function (err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message written');
        });
        for (var i = 0; i < testCommands.length; i++) {
            let testCommand = testCommands[i];
            console.log('EX: ' + testCommand.description);
        }
    }
}
let tester = new SerialDeviceTester();
tester.testDevice(config);
//# sourceMappingURL=elo_device_test.js.map