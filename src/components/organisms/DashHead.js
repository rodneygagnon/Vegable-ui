import React, { Component } from 'react';
import Skycons from 'react-skycons';

class DashHead extends Component {

  static defaultProps = {
		title: "Dashboard",
    subtitle: "Productivity & Resource Utilization",
	}

  constructor(props) {
    super(props);
    this.state = {
      conditionsSummary: '',
      conditionsTemperature: 50,
    }
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/weather/get')
			.then(conditions => conditions.json())
			.then(conditions => {
        this.setState({
          conditionsSummary: conditions.summary,
          conditionsIcon: conditions.icon.toUpperCase().replace(/-/g,'_'),
          conditionsTemperature: conditions.temperature.toFixed(1),
        });
      });
  }

  componentDidUpdate() {
	}

  render () {
    const { title, subtitle } = this.props;
    return (
      <div className="dashhead">
        <div className="dashhead-titles">
          <h6 className="dashhead-subtitle">{subtitle}</h6>
          <h3 className="dashhead-title">{title}</h3>
        </div>

        <div className="dashhead-toolbar">
          <div className="dashhead-toolbar-item">
            <Skycons color='black' icon={this.state.conditionsIcon} autoplay={true} width="64" height="64"/>
          </div>
          <span className="dashhead-toolbar-divider d-none d-md-inline-block"></span>
          <div className="dashhead-toolbar-item">
            <p id="weatherString" className="lead">{this.state.conditionsSummary}, {this.state.conditionsTemperature}˚F</p>
          </div>
        </div>
      </div>
    );
  }
}

export default DashHead
