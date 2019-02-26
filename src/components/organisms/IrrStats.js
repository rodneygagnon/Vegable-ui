import React, { Component } from 'react';
import moment from 'moment';
import pattern from 'patternomaly';

import { Bar } from 'react-chartjs-2';

let chartData = {
  datasets: []
};

let chartOptions = {
  responsive: true,
  legend: {
    position: 'bottom',
  },
  tooltips: {
    callbacks: {
      label: function(tooltipItem, data) {
        const zoneData = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.datasetIndex];
        const time = moment(zoneData.x).format('h:mm a');

        let label = data.datasets[tooltipItem.datasetIndex].label;
        if (label) {
            label += ': ';
        }
        label += `${tooltipItem.yLabel} gal @ ${time}`;

        return label;
      }
    }
  },
  scales: {
    xAxes: [{
      type: "time",
      time: {
        unit: 'day',
        round: 'day',
        tooltipFormat: 'MMM D',
        displayFormats: {
          day: 'MMM D'
        }
      },
      gridLines: {
        offsetGridLines: true
      }
    }],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Gallons'
      },
      ticks: {
        beginAtZero: true
      }
    }]
  }
}

class IrrStats extends Component {

  constructor(props) {
    super(props);
    this.state = {
      irrTotal: 0,
      irrEvents: 0,
      fertEvents: 0,
      data: chartData,
      options: chartOptions,
    }
  }

  initZoneData(zone, first, last) {
    const next = new Date(first);
    const data = [];
    const colors = [];

    while (next <= last) {
      data.push({ x: new Date(next), y: 0 });
//      colors.push(color(zone.color).alpha(0.85).rgbString());
      colors.push(zone.color);
      next.setDate(next.getDate() + 1);
    }

    return { zone: zone, zoneData: data, zoneColors: colors };
  };

  componentDidMount() {
    const start = new Date();
    start.setMonth(0);
    start.setDate(1);

    const end = new Date();

    fetch(`http://localhost:3001/api/stats/get?start=${start.getTime()}&stop=${end.getTime()}`)
			.then(stats => stats.json())
			.then(stats => {
        console.log(stats);
        if (stats.length > 0) {
          let irrTotal = 0;
          let fertEvents = 0;

          const firstDate = new Date(stats[0].started);
          firstDate.setDate(firstDate.getDate() - 1);

          const lastDate = new Date(stats[stats.length - 1].started);
          lastDate.setDate(lastDate.getDate() + 1);

          fetch('http://localhost:3001/api/zones/get/planting')
      			.then(zones => zones.json())
      			.then(zones => {

              const statsTable = {};
              for (let i = 0; i < zones.length; i++) {
                statsTable[zones[i].id] = this.initZoneData(zones[i], firstDate, lastDate);
              }

              for (let i = 0; i < stats.length; i++) {
                const day = moment(stats[i].started).diff(moment(firstDate), 'days');
                const amount = Math.floor(stats[i].amount * 100) / 100;

                statsTable[stats[i].zid].zoneData[day] = {
                  x: new Date(stats[i].started),
                  y: amount
                };

                irrTotal += amount;

                const fertilizerObj = JSON.parse(stats[i].fertilizer);
                const fertilized = (fertilizerObj.n || fertilizerObj.p || fertilizerObj.k) ? true : false;
                if (fertilized) {
                  fertEvents += 1;
                  statsTable[stats[i].zid].zoneColors[day] = pattern.draw('diagonal', statsTable[stats[i].zid].zoneColors[day]);
                }
              }

              for (const zid in statsTable) {
                chartData.datasets.push({
                  label: statsTable[zid].zone.name,
                  backgroundColor: statsTable[zid].zoneColors,
                  data: statsTable[zid].zoneData
                });
              }

              this.setState({
                irrTotal: irrTotal.toFixed(1),
                irrEvents: stats.length,
                fertEvents: fertEvents,
              });
            });
          }
      });
  }

  componentDidUpdate() {
	}

  render () {
    console.log(this.state);
    return (
      <div>
        <h4 id="irrTotal" className="mt-4">{this.state.irrTotal} Gallons</h4>
        <h6 id="irrEvents" className="mb-4">Irrigated: {this.state.irrEvents}x  Fertilized: {this.state.fertEvents}x</h6>
        <div className="row justify-content-between">
          <div className="col-lg-12 py-6">
              <Bar data={this.state.data} options={this.state.options}/>
          </div>
        </div>
      </div>
    );
  }
}


export default IrrStats
