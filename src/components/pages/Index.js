import React, { Component } from 'react';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { IconNav } from '../molecules/IconNav';
import DashHead from '../organisms/DashHead';
import Forecast from '../organisms/Forecast';
import IrrStats from '../organisms/IrrStats';

import '../../assets/css/toolkit-light.css';
import '../../assets/css/application.css';

class Index extends Component {
  render() {
    var headerTitles = { title: "Dashboard", subtitle: "Productivity & Resource Utilization" };

    return (
      <div className="with-iconav">
        <IconNav />
        <div className="container">
          <DashHead {...headerTitles}/>

          <Tabs defaultActiveKey="forecast" id="indexTabs">
            <Tab eventKey="forecast" title="Forecast">
              <h4 className="my-4">5 Day Forecast</h4>
              <Forecast />
            </Tab>
            <Tab eventKey="irrigation" title="Irrigation">
              <IrrStats />
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}
export default Index
