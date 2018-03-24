import React,{Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
//import {LineChart} from 'react-d3-basic';

let printCharacteristic;


export default class App extends Component {

    characteristic;
    constructor() {
        super();
        this.state = { chartData: []};
        this.BLEConnect = this.BLEConnect.bind(this);
    }

    heartRateChange(event){
        const value = event.target.value;
        const currentHeartRate = value.getUint8(1);
        const chartData = [...this.state.chartData, {time: +Date.now(),heartRate:currentHeartRate}];
        this.setState({chartData});
        console.log('currentHeartRate:', currentHeartRate);
    }

    BLEConnect(){
      /*
        return navigator.bluetooth.requestDevice({filters: [{services: ['heart_rate']}]})
            .then(device => {
                return device.gatt.connect();
            })
            .then(server => {
                return server.getPrimaryService('heart_rate')
            })
            .then(service => {
                return service.getCharacteristic('heart_rate_measurement')
            })
            .then(character => {
                this.characteristic = character;
                return this.characteristic.startNotifications().then(_ => {
                    this.characteristic.addEventListener('characteristicvaluechanged',
                        this.heartRateChange.bind(this));
                });
            })
            .catch(e => console.error(e));
            */

    navigator.bluetooth.requestDevice({
        filters: [{
            services: ['000018f0-0000-1000-8000-00805f9b34fb']
        }]
    })
        .then(device => {
            console.log('> Found ' + device.name);
            console.log('Connecting to GATT Server...');
            return device.gatt.connect();
        })
        .then(server => server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb"))
        .then(service => service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb"))
        .then(characteristic => {
            printCharacteristic = characteristic;
            console.log(printCharacteristic); // printCharacteristic.writeValueで書き込めるっぽい
            //let text1 = new Uint8Array([1]);
            //printCharacteristic.writeValue(text);


            let encoder = new TextEncoder("utf-8");
          // Add line feed + carriage return chars to text
          let text = encoder.encode('THIS IS TEST PRINTING BY MUHAMMAD MANNIR AHMAD' + '\u000A\u000D');
          return printCharacteristic.writeValue(text).then(() => {
            console.log('Print Sent!');
          });

        })
        .catch(error => console.log(error));


            console.log('BLEConnect')
    }


    render() {
        const currentHearRate = this.state.chartData[this.state.chartData.length-1];
        const margins = {left: 100, right: 100, top: 20, bottom: 50};
        const chartSeries = [
            {
                field: 'heartRate',
                color: '#C20000'
            }
        ];

        return(
            <div id="app">
                <RaisedButton onClick={this.BLEConnect} label="Start Printing!" primary={true} />
                {currentHearRate && <p>Current Heart Rate: <span style={{color:'#C20000'}}>{currentHearRate.heartRate}</span></p>}


                <br />  Mannir React Material-UI Bluetooth Web Demo
            </div>
        );
    }
}
