import { React, Component } from 'react';
import { RoundToPointFive, ConvertToCelsius, ConvertToFahrenheit, FormatTemperature, StateMap, ModeMap, FanModeMap, TimeToString } from '../../Utilities/Utilities';
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
        const celsius = cookies.get("use-celsius") && cookies.get("use-celsius") === 'true';
        const increment = parseFloat(cookies.get("increment")) || .5;

        super(props);
        this.state = {
            busy: false,
            celsius: celsius,
            increment: increment,
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

        this.setCoolHandler = this.setCool.bind(this);
        this.setHeatHandler = this.setHeat.bind(this);
        this.onIncrementChangeHandler = this.onIncrementChange.bind(this);
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
        var newTargetHeat = this.state.thermostatState.t_heat + (adjust * this.state.increment);
        
        if(this.state.celsius) {
            newTargetHeat = ConvertToFahrenheit(ConvertToCelsius(this.state.thermostatState.t_heat) + (adjust * this.state.increment));
            newTargetHeat = adjust > 0 ? Math.ceil(newTargetHeat) : Math.floor(newTargetHeat);        
        }

        const json = {
            t_heat: newTargetHeat
        };
        this.postCommand(JSON.stringify(json));
    }

    setCool(adjust) {
        var newTargetCool = this.state.thermostatState.t_cool + (adjust * this.state.increment);
        
        if(this.state.celsius) {
            newTargetCool = ConvertToFahrenheit(ConvertToCelsius(this.state.thermostatState.t_cool) + (adjust * this.state.increment));
            newTargetCool = adjust > 0 ? Math.ceil(newTargetCool) : Math.floor(newTargetCool);        
        }

        const json = {
            t_cool: newTargetCool
        };
        this.postCommand(JSON.stringify(json));
    }

    onUnitChange() {
        var newCelsius = !this.state.celsius;
        this.setState({
            celsius: newCelsius
        });
        cookies.set("use-celsius", newCelsius);
    }

    onIncrementChange(e) {
        const newIncrement = parseFloat(e.target.value);
        if (newIncrement) {
            this.setState({
                increment: newIncrement
            });
            cookies.set("increment", newIncrement);
        }
    }

    render() {
        const status = this.state.thermostatState;
        let target;
        if (status.tmode === 1) {
            target = <h2>Heat Target: <span className="Target_HEAT">{FormatTemperature(this.state.celsius ? ConvertToCelsius(status.t_heat) : status.t_heat)}&deg;</span>
                <button disabled={this.state.busy} onClick={() => this.setHeatHandler(-1)}>-</button>
                <input value={this.state.increment} onChange={this.onIncrementChangeHandler} />
                <button disabled={this.state.busy} onClick={() => this.setHeatHandler(1)}>+</button>
            </h2>;
        } else {
            target = <h2>Cool Target: <span className="Target_COOL">{FormatTemperature(this.state.celsius ? ConvertToCelsius(status.t_cool) : status.t_cool)}&deg;</span>
                <button disabled={this.state.busy} onClick={() => this.setCoolHandler(-1)}>-</button>
                <input value={this.state.increment} onChange={this.onIncrementChangeHandler} />
                <button disabled={this.state.busy} onClick={() => this.setCoolHandler(1)}>+</button>
            </h2>;
        }

        return <div>
            <h2>Current Temp: {FormatTemperature(this.state.celsius ? ConvertToCelsius(status.temp) : status.temp)}&deg;&nbsp;
                <button disabled={this.state.busy} onClick={() => this.getThermostatState()}>REFRESH</button>
            </h2>
            {target}
            <h2>Mode: <span className={`Mode_${ModeMap.get(status.tmode)}`}>{ModeMap.get(status.tmode)}</span>
                <button disabled={this.state.busy} onClick={() => this.setMode(0)}>OFF</button>
                <button disabled={this.state.busy} onClick={() => this.setMode(1)}>HEAT</button>
                <button disabled={this.state.busy} onClick={() => this.setMode(2)}>COOL</button>
                <button disabled={this.state.busy} onClick={() => this.setMode(3)}>AUTO</button>
            </h2>
            <h2>Hold: <span className={`Hold_${status.hold ? "ON" : "OFF"}`}>{status.hold ? "ON" : "OFF"}</span>
                <button disabled={this.state.busy} onClick={() => this.setHold(0)}>OFF</button>
                <button disabled={this.state.busy} onClick={() => this.setHold(1)}>ON</button>
            </h2>
            <h2>
                Fan Mode: <span className={`Fan_${FanModeMap.get(status.fmode)}`}>{FanModeMap.get(status.fmode)}</span>
                <button disabled={this.state.busy} onClick={() => this.setFan(0)}>AUTO</button>
                <button disabled={this.state.busy} onClick={() => this.setFan(1)}>CIRCULATE</button>
                <button disabled={this.state.busy} onClick={() => this.setFan(2)}>ON</button>
            </h2>
            <hr></hr>
            <h2>Fan State: <span className={`FanState_${status.fstate ? "ON" : "OFF"}`}>{status.fstate ? "ON" : "OFF"}</span></h2>
            <h2>Furnace State: <span className={`State_${ModeMap.get(status.tstate)}`}>{StateMap.get(status.tstate)}</span></h2>
            <h2>Thermostat Time: {TimeToString(status.time)}</h2>
            <h3><Checkbox label={"Celsius"} onChange={() => this.onUnitChange()} value={this.state.celsius} /></h3>
        </div>
    }
}
export default Main;  