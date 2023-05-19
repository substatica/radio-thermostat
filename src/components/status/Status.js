import React, { Component } from 'react';
import {FahrenheitToCelsius, FormatTemperature, StateMap, ModeMap, FanModeMap} from '../../utilities/Utilities';

const TSTAT_ADDRESS = "/tstat"; //`http://${process.env.THERMOSTAT_IP_ADDRESS}/tstat`;

class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {
            busy: false,
            thermostatState: {
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
    }    

    getThermostatState() {
        this.setState({
            busy: true
        });
        const headers = { 
            'Accept': 'application/json',
        }
        fetch(TSTAT_ADDRESS, { headers })
            .then(response => {
                response.json().then(data => {
                    this.setState({
                        busy: false,
                        thermostatState:data
                    });
                });
            })
    }

    postCommand(json) {
        this.setState({
            busy: true
        });
        fetch(TSTAT_ADDRESS, {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: json
           }).then(response => {
            response.json().then(data => {
                this.getThermostatState();
            });
        })
    }

    componentDidMount() {
        this.getThermostatState();
    }
    
    setFan (mode) {
        const json = {
            fmode: mode
        };
        this.postCommand(JSON.stringify(json));
    }

    setMode (mode) {
        const json = {
            tmode: mode
        };
        this.postCommand(JSON.stringify(json));
    }

    setHold (hold) {
        const json = {
            hold: hold
        };
        this.postCommand(JSON.stringify(json));
    }

    setHeat (adjust) {
        const json = {            
            t_heat: this.state.thermostatState.t_heat + adjust
        };
        this.postCommand(JSON.stringify(json));
    }

    setCool (adjust) {
        const json = {
            t_cool: this.state.thermostatState.t_cool + adjust
        };
        this.postCommand(JSON.stringify(json));
    }

    render() {
        const status = this.state.thermostatState;
        let target;
        if (status.tmode === 1) {
            target = <h2>Heat Target: {FormatTemperature(FahrenheitToCelsius(status.t_heat))}&deg;&nbsp;
                    <button disabled={this.state.busy} onClick={() => this.setHeat(-.5)}>-</button> 
                    <button disabled={this.state.busy} onClick={() => this.setHeat(.5)}>+</button>
                </h2>;
        } else {
            target = <h2>Cool Target: {FormatTemperature(FahrenheitToCelsius(status.t_cool))}&deg;&nbsp;
                    <button disabled={this.state.busy} onClick={() => this.setCool(-.5)}>-</button> 
                    <button disabled={this.state.busy} onClick={() => this.setCool(.5)}>+</button>
                </h2>;
        }

        return <div>
            <h2>Current Temp: {FormatTemperature(FahrenheitToCelsius(status.temp))}&deg;&nbsp;
                <button disabled={this.state.busy} onClick={() => this.getThermostatState()}>REFRESH</button> 
            </h2>
            {target}
            <h2>Mode: {ModeMap.get(status.tmode)}&nbsp;
                <button disabled={this.state.busy} onClick={() => this.setMode(0)}>OFF</button> 
                <button disabled={this.state.busy} onClick={() => this.setMode(1)}>HEAT</button> 
                <button disabled={this.state.busy} onClick={() => this.setMode(2)}>COOL</button> 
                <button disabled={this.state.busy} onClick={() => this.setMode(3)}>AUTO</button> 
            </h2>
            <h2>Hold: {status.hold ? "ON" : "OFF"}&nbsp;
                <button disabled={this.state.busy} onClick={() => this.setHold(0)}>OFF</button> 
                <button disabled={this.state.busy} onClick={() => this.setHold(1)}>ON</button>
            </h2>
            <h2>
                Fan Mode: {FanModeMap.get(status.fmode)}&nbsp;
                <button disabled={this.state.busy} onClick={() => this.setFan(0)}>AUTO</button> 
                <button disabled={this.state.busy} onClick={() => this.setFan(1)}>CIRCULATE</button> 
                <button disabled={this.state.busy} onClick={() => this.setFan(2)}>ON</button>
            </h2>
            <hr></hr>
            <h2>Fan State: {status.fstate ? "ON" : "OFF"}</h2>
            <h2>Furnace State: {StateMap.get(status.tstate)}</h2>
            <h2>Time: {status.time.hour}:{status.time.minute}</h2>

        </div>
    }
}
export default Status;  