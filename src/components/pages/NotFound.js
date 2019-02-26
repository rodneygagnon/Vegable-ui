import React, { Component } from 'react';

import '../../assets/css/toolkit-light.css';
import '../../assets/css/application.css';

import logo from '../../assets/img/logos/logo-red-black.svg';
import error from '../../assets/img/error-404.svg';

class NotFound extends Component {
  render() {
    return (
      <div>
        <header id="header" className="u-header u-header--abs-top">
          <div className="u-header__section bg-transparent border-0">
            <div id="logoAndNav" className="container-fluid">
              <nav className="navbar navbar-expand justify-content-between u-header__navbar py-3">
                <div className="col-4 col-sm-6">
                  <a className="navbar-brand u-header__navbar-brand" href="/" aria-label="Vegable">
                    <img className="u-header__navbar-brand-default" src={logo} alt="Logo" height="48px"/>
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </header>
        <div className="bg-gray-100 mt-4">
          <div className="d-flex align-items-center height-100vh">
            <div className="container text-center">
              <div className="w-lg-60 mx-lg-auto">
                <object type="image/svg+xml" data={error}>404</object>
                <h2 className="mb-3">Page not found</h2>
                <p className="lead mb-0">Oops! Looks like you followed a bad link.</p>
                <p className="lead mb-0">If you think this is a problem with us, please tell us.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default NotFound
