import React, { Component } from 'react';
import Skycons from 'react-skycons';
import moment from 'moment';

let defaultForecast = [
  {day: 'Today', summary: 'Clear Conditions', icon: 'CLEAR_DAY', temperatureHigh: 50, temperatureLow: 30, precip: 0, precipProbability: 0},
  {day: 'Tomorrow', summary: 'Clear Conditions', icon: 'CLEAR_DAY', temperatureHigh: 50, temperatureLow: 30, precip: 0, precipProbability: 0},
  {day: 'Wednesday', summary: 'Clear Conditions', icon: 'CLEAR_DAY', temperatureHigh: 50, temperatureLow: 30, precip: 0, precipProbability: 0},
  {day: 'Thursday', summary: 'Clear Conditions', icon: 'CLEAR_DAY', temperatureHigh: 50, temperatureLow: 30, precip: 0, precipProbability: 0},
  {day: 'Friday', summary: 'Clear Conditions', icon: 'CLEAR_DAY', temperatureHigh: 50, temperatureLow: 30, precip: 0, precipProbability: 0},
]

class Forecast extends Component {

  constructor(props) {
    super(props);
    this.state = {
      forecast: defaultForecast,
    }
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/forecast/get')
			.then(forecast => forecast.json())
			.then(forecast => {
        // No more that 5 days
        let forecastState = [];
        const forecastLength = forecast.length < 5 ? forecast.length : 5;
        for (let day = 0; day < forecastLength; day++) {
          forecastState[day] = {
            day: (day === 0 ? 'Today' :
                              (day === 1 ? 'Tomorrow' :
                                moment.unix(forecast[day].time).format('dddd'))),
            summary: forecast[day].summary,
            icon: forecast[day].icon.toUpperCase().replace(/-/g,'_'),
            temperatureHigh: forecast[day].temperatureHigh.toFixed(0),
            temperatureLow: forecast[day].temperatureLow.toFixed(0),
            precip: (forecast[day].precipIntensity * 24).toFixed(1),
            precipProbability: (forecast[day].precipProbability * 100).toFixed(1),
          };
        }
        this.setState({ forecast: forecastState });
      });
  }

  componentDidUpdate() {
	}

  render () {
    return (
      <div className="row justify-content-between">
        <div className="col-lg-2 py-6">
          <h5>{this.state.forecast[0].day}</h5>
          <div className="py-3">
            <Skycons icon={this.state.forecast[0].icon} autoplay={true}/>
          </div>
          <h6>High: {this.state.forecast[0].temperatureHigh}˚ Low: {this.state.forecast[0].temperatureLow}˚</h6>
          <h6>Precip {this.state.forecast[0].precip}&quot; {this.state.forecast[0].precipProbability}%</h6>
          <p>{this.state.forecast[0].summary}</p>
        </div>
        <div className="col-lg-2 py-6">
          <h5>{this.state.forecast[1].day}</h5>
          <div className="py-3">
            <Skycons icon={this.state.forecast[1].icon} autoplay={true}/>
          </div>
          <h6>High: {this.state.forecast[0].temperatureHigh}˚ Low: {this.state.forecast[0].temperatureLow}˚</h6>
          <h6>Precip {this.state.forecast[0].precip}&quot; {this.state.forecast[0].precipProbability}%</h6>
          <p>{this.state.forecast[0].summary}</p>
        </div>
        <div className="col-lg-2 py-6">
          <h5>{this.state.forecast[2].day}</h5>
          <div className="py-3">
            <Skycons icon={this.state.forecast[2].icon} autoplay={true}/>
          </div>
          <h6>High: {this.state.forecast[0].temperatureHigh}˚ Low: {this.state.forecast[0].temperatureLow}˚</h6>
          <h6>Precip {this.state.forecast[0].precip}&quot; {this.state.forecast[0].precipProbability}%</h6>
          <p>{this.state.forecast[0].summary}</p>
        </div>
        <div className="col-lg-2 py-6">
          <h5>{this.state.forecast[3].day}</h5>
          <div className="py-3">
            <Skycons icon={this.state.forecast[3].icon} autoplay={true}/>
          </div>
          <h6>High: {this.state.forecast[3].temperatureHigh}˚ Low: {this.state.forecast[3].temperatureLow}˚</h6>
          <h6>Precip {this.state.forecast[3].precip}&quot; {this.state.forecast[3].precipProbability}%</h6>
          <p>{this.state.forecast[3].summary}</p>
        </div>
        <div className="col-lg-2 py-6">
          <h5>{this.state.forecast[4].day}</h5>
          <div className="py-3">
            <Skycons icon={this.state.forecast[4].icon} autoplay={true}/>
          </div>
          <h6>High: {this.state.forecast[4].temperatureHigh}˚ Low: {this.state.forecast[4].temperatureLow}˚</h6>
          <h6>Precip {this.state.forecast[4].precip}&quot; {this.state.forecast[4].precipProbability}%</h6>
          <p>{this.state.forecast[4].summary}</p>
        </div>
      </div>
    );
  }
}

export default Forecast
