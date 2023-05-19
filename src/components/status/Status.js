import React, { Component } from 'react';

const STATUS_ADDRESS = "/tstat"; //`http://${process.env.THERMOSTAT_IP_ADDRESS}/tstat`;

class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {
            temp: 0,
            tmode: 0,
            fmode: 0,
            override: 0,
            hold: 0,
            t_heat: 0,
            tstate: 0,
            fstate: 0,
            time: {
                day: 0,
                hour: 0,
                minute: 0, 
            },
            t_type_post: 0
        }
    }    

    componentDidMount() {
        console.log(STATUS_ADDRESS);

        // GET request using fetch with set headers
        const headers = { 
            'Accept': 'application/json',
        }
        fetch(STATUS_ADDRESS, { headers })
            .then(response => {
                response.json().then(data => {
                    this.setState(data);
                    console.log(data);
                });
            })
    }
    
    render() {
        return <h2>Current Temp: {this.state.temp}</h2>
    }
}
export default Status;  