import React,{Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';


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
                <RaisedButton onClick={this.BLEConnect} label="Start Monitoring!" primary={true} />
                {currentHearRate && <p>Current Heart Rate: <span style={{color:'#C20000'}}>{currentHearRate.heartRate}</span></p>}

            </div>
        );
    }
}
