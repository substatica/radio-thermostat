import { React, Component } from 'react';
import { ConvertUnit, FormatTemperature, StateMap, ModeMap, FanModeMap, TimeToString } from '../../Utilities/Utilities';
import Cookies from 'universal-cookie';
import Checkbox from '../Checkbox/Checkbox';

let TSTAT_ADDRESS;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    TSTAT_ADDRESS = "tstat";
} else {
    TSTAT_ADDRESS = `proxy.php`;
}

const cookies = new Cookies();

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            busy: false,
            celsius: cookies.get("use-celsius"),
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
                        thermostatState: data
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
            headers: { 'Content-Type': 'application/json' },
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

    setFan(mode) {
        const json = {
            fmode: mode
        };
        this.postCommand(JSON.stringify(json));
    }

    setMode(mode) {
        const json = {
            tmode: mode
        };
        this.postCommand(JSON.stringify(json));
    }

    setHold(hold) {
        const json = {
            hold: hold
        };
        this.postCommand(JSON.stringify(json));
    }

    setHeat(adjust) {
        const json = {
            t_heat: this.state.thermostatState.t_heat + adjust
        };
        this.postCommand(JSON.stringify(json));
    }

    setCool(adjust) {
        const json = {
            t_cool: this.state.thermostatState.t_cool + adjust
        };
        this.postCommand(JSON.stringify(json));
    }

    onChange() {
        this.setState({
            celsius: !this.state.celsius
        });
        cookies.set("use-celsius", this.state.celsius);
    }

    render() {
        const status = this.state.thermostatState;
        let target;
        if (status.tmode === 1) {
            target = <h2>Heat Target: <span class="Target_HEAT">{FormatTemperature(ConvertUnit(status.t_heat, this.state.celsius))}&deg;</span>
                <button disabled={this.state.busy} onClick={() => this.setHeat(-.5)}>-</button>
                <button disabled={this.state.busy} onClick={() => this.setHeat(.5)}>+</button>
            </h2>;
        } else {
            target = <h2>Cool Target: <span class="Target_COOL">{FormatTemperature(ConvertUnit(status.t_cool, this.state.celsius))}&deg;</span>
                <button disabled={this.state.busy} onClick={() => this.setCool(-.5)}>-</button>
                <button disabled={this.state.busy} onClick={() => this.setCool(.5)}>+</button>
            </h2>;
        }

        return <div>
            <h2>Current Temp: {FormatTemperature(ConvertUnit(status.temp, this.state.celsius))}&deg;&nbsp;
                <button disabled={this.state.busy} onClick={() => this.getThermostatState()}>REFRESH</button>
            </h2>
            {target}
            <h2>Mode: <span class={`Mode_${ModeMap.get(status.tmode)}`}>{ModeMap.get(status.tmode)}</span>
                <button disabled={this.state.busy} onClick={() => this.setMode(0)}>OFF</button>
                <button disabled={this.state.busy} onClick={() => this.setMode(1)}>HEAT</button>
                <button disabled={this.state.busy} onClick={() => this.setMode(2)}>COOL</button>
                <button disabled={this.state.busy} onClick={() => this.setMode(3)}>AUTO</button>
            </h2>
            <h2>Hold: <span class={`Hold_${status.hold ? "ON" : "OFF"}`}>{status.hold ? "ON" : "OFF"}</span>
                <button disabled={this.state.busy} onClick={() => this.setHold(0)}>OFF</button>
                <button disabled={this.state.busy} onClick={() => this.setHold(1)}>ON</button>
            </h2>
            <h2>
                Fan Mode: <span class={`Fan_${FanModeMap.get(status.fmode)}`}>{FanModeMap.get(status.fmode)}</span>
                <button disabled={this.state.busy} onClick={() => this.setFan(0)}>AUTO</button>
                <button disabled={this.state.busy} onClick={() => this.setFan(1)}>CIRCULATE</button>
                <button disabled={this.state.busy} onClick={() => this.setFan(2)}>ON</button>
            </h2>
            <hr></hr>
            <h2>Fan State: <span class={`FanState_${status.fstate ? "ON" : "OFF"}`}>{status.fstate ? "ON" : "OFF"}</span></h2>
            <h2>Furnace State: <span class={`State_${ModeMap.get(status.tstate)}`}>{StateMap.get(status.tstate)}</span></h2>
            <h2>Thermostat Time: {TimeToString(status.time)}</h2>
            <h3><Checkbox label={"Celsius"} onChange={() => this.onChange()} value={this.state.celsius} /></h3>
        </div>
    }
}
export default Main;  