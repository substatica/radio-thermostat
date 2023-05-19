import React, { Component } from 'react';
import {FahrenheitToCelsius, FormatTemperature, StateMap, ModeMap} from '../../utilities/Utilities';

const STATUS_ADDRESS = "/tstat"; //`http://${process.env.THERMOSTAT_IP_ADDRESS}/tstat`;

class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {
            temp: undefined,
            tmode: undefined,
            fmode: undefined,
            override: undefined,
            hold: undefined,
            t_heat: undefined,
            tstate: undefined,
            fstate: undefined,
            time: {
                day: undefined,
                hour: undefined,
                minute: undefined, 
            },
            t_type_post: undefined
        }
    }    

    componentDidMount() {
        const headers = { 
            'Accept': 'application/json',
        }
        fetch(STATUS_ADDRESS, { headers })
            .then(response => {
                response.json().then(data => {
                    this.setState(data);
                });
            })
    }
    
    render() {
        const status = this.state;
        let target;
        if (status.tmode === 1) {
            target = <h2>Heat Target: {FormatTemperature(FahrenheitToCelsius(status.t_heat))}&deg;</h2>;
        } else {
            target = <h2>Cool Target: {FormatTemperature(FahrenheitToCelsius(status.t_cool))}&deg;</h2>;
        }

        return <div>
            <h2>Temp: {FormatTemperature(FahrenheitToCelsius(status.temp))}&deg;</h2>
            {target}
            <h2>Mode: {ModeMap.get(status.tmode)}</h2>
            <h2>Hold: {status.hold ? "ON" : "OFF"}</h2>
            <h2>Fan: {status.fstate ? "ON" : "OFF"}</h2>
            <h2>State: {StateMap.get(status.tstate)}</h2>
            <h2>Time: {status.time.hour}:{status.time.minute}</h2>

        </div>
    }
}
export default Status;  