import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'

import './index.css';
import Index from './components/pages/Index';
import Zones from './components/pages/Zones';
import Plantings from './components/pages/Plantings';
import Events from './components/pages/Events';
import Settings from './components/pages/Settings';
import NotFound from './components/pages/NotFound';
import * as serviceWorker from './serviceWorker';

const routing = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/zones" component={Zones} />
        <Route path="/plantings" component={Plantings} />
        <Route path="/events" component={Events} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
