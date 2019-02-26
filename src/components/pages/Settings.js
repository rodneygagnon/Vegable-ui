import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import BootstrapTable from 'react-bootstrap-table-next';
import Select from 'react-select';

import { IconNav } from '../molecules/IconNav';
import DashHead from '../organisms/DashHead';

import '../../assets/css/bootstrap-table.css';
import '../../assets/css/bootstrap-select.css';
import '../../assets/css/toolkit-light.css';
import '../../assets/css/application.css';

import add from '../../assets/img/icons/add.svg';

class BasicSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: {},
    };

    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleETrChange = this.handleETrChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    var states = [
      { value: "", label: "" }, { value: "AL", label: "AL" }, { value: "AK", label: "AK" },
      { value: "AZ", label: "AZ" }, { value: "AR", label: "AR" }, { value: "CA", label: "CA" },
      { value: "CO", label: "CO" }, { value: "CT", label: "CT" }, { value: "DE", label: "DE" },
      { value: "DC", label: "DC" }, { value: "FL", label: "FL" }, { value: "GA", label: "GA" },
      { value: "HI", label: "HI" }, { value: "ID", label: "ID" }, { value: "IL", label: "IL" },
      { value: "IN", label: "IN" }, { value: "IA", label: "IA" }, { value: "KS", label: "KS" },
      { value: "KY", label: "KY" }, { value: "LA", label: "LA" }, { value: "MA", label: "MA" },
      { value: "ME", label: "ME" }, { value: "MD", label: "MD" }, { value: "MI", label: "MI" },
      { value: "MN", label: "MN" }, { value: "MO", label: "MO" }, { value: "MS", label: "MS" },
      { value: "MT", label: "MT" }, { value: "NC", label: "NC" }, { value: "ND", label: "ND" },
      { value: "NE", label: "NE" }, { value: "NH", label: "NH" }, { value: "NJ", label: "NJ" },
      { value: "NM", label: "NM" }, { value: "NY", label: "NY" }, { value: "OH", label: "OH" },
      { value: "OK", label: "OK" }, { value: "OR", label: "OR" }, { value: "PA", label: "PA" },
      { value: "RI", label: "RI" }, { value: "SC", label: "SC" }, { value: "SD", label: "SD" },
      { value: "TN", label: "TN" }, { value: "TX", label: "TX" }, { value: "UT", label: "UT" },
      { value: "VT", label: "VT" }, { value: "VA", label: "VA" }, { value: "WA", label: "WA" },
      { value: "WV", label: "WV" }, { value: "WI", label: "WI" }, { value: "WY", label: "WY" },
    ];

    fetch('http://localhost:3001/api/etrs/get')
      .then(etrs => etrs.json())
      .then(etrs => {
        fetch('http://localhost:3001/api/location/get')
          .then(location => location.json())
          .then(location => {
            let etrList = [];
            let selectedEtr;
            for (let i = 0; i < etrs.length; i++) {
              let etrItem = { value: etrs[i].zone, label: etrs[i].title }
              if (etrItem.value === location.etzone) {
                selectedEtr = etrItem;
              }
              etrList.push(etrItem);
            }

            let selectedState;
            for (var i = 0; i < states.length; i++) {
              if (states[i].value == location.state) {
                selectedState = states[i];
                break;
              }
            }

            this.setState({
              location: location,
              etrList: etrList,
              stateList: states,
              selectedState: selectedState,
              selectedEtr: selectedEtr,
            });
          });
      });
  }

  handleStateChange(state) {
    this.setState({
      selectedState: state,
    });
  }

  handleETrChange(etr) {
    this.setState({
      selectedEtr: etr,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    let location = {
      address: data.get('address'),
      city: data.get('city'),
      state: data.get('state'),
      zip: data.get('zip'),
      etzone: data.get('etzone'),
    }

    console.log(location);

    fetch('http://localhost:3001/api/location/set', {
      method: 'POST',
      body: JSON.stringify(location),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(response => {
      console.log("Response: " + JSON.stringify(response));
      window.location.reload();
    });
  }

  render() {
    console.log(this.state.selectedEtr);
    console.log(this.state.selectedState);

    return (
      <>
        <h4 className="my-4">Location</h4>
        <Form onSubmit={this.handleSubmit}>
          <div className="row mb-4">
            <div className="col">
              <Form.Group controlId="formZoneName">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="address" defaultValue={this.state.location.address} required/>
              </Form.Group>
            </div>
            <div className="col">
              <Form.Group controlId="formZoneStart">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" name="city" defaultValue={this.state.location.city} required/>
              </Form.Group>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col">
              <Form.Group controlId="formZoneSWHC">
                <Form.Label>State</Form.Label>
                <Select name="state" options={this.state.stateList} onChange={state => this.handleStateChange(state)}
                  defaultValue={this.state.selectedState} value={this.state.selectedState}/>
              </Form.Group>
            </div>
            <div className="col">
              <Form.Group controlId="formZoneArea">
                <Form.Label>Zipcode</Form.Label>
                <Form.Control name="zip" type="text" defaultValue={this.state.location.zip} required/>
              </Form.Group>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-8">
              <h5>Evapotranspiration Reference (ETr) Zone</h5>
              <p>
                Evapotranspiration (ET) is the term used to describe the loss of water to the atmosphere by the combined processes of evaporation (from soil and plant surfaces) and transpiration (from plant tissues) and is needed for irrigation scheduling. Vegable retrieves ETo from CIMIS to calculate ETc for plantings/crops. If the CIMIS ETo can not be obtained, the ETr for your zone is used.
              </p>
              <p>
                Choose the zone that most accurately represents the micro climate at your location.
              </p>
              <Form.Group controlId="formETZone">
                <Select name="etzone" options={this.state.etrList} onChange={etr => this.handleETrChange(etr)}
                  defaultValue={this.state.selectedEtr} value={this.state.selectedEtr}/>
              </Form.Group>
            </div>
          </div>

          <Button className="btn btn-primary mr-auto" variant="primary" type="submit"> Submit </Button>
        </Form>
      </>
    );
  }
}

class CropsTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalShow: false,
      crop: [],
      crops: [],
      columns: [
        {
          dataField: 'id',
          iskey: true,
          hidden: true,
        },
        {
          dataField: 'name',
          text: 'Name',
          sort: true,
        },
        {
          dataField: 'initDay',
          text: 'Total Days',
          sort: true,
          formatter: function (value, row) {
            return (row.initDay + row.devDay + row.midDay + row.lateDay);
          },
        },
        {
          dataField: 'initKc',
          text: 'Total Kc',
          sort: true,
          formatter: function (value, row) {
            return ((row.initDay * row.initKc + row.devDay * row.devKc
                   + row.midDay * row.midKc + row.lateDay * row.lateKc).toFixed(0));
          },
        },
      ],
    }
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/crops/get')
      .then(crops => crops.json())
      .then(crops => {
        this.setState({
          crops: crops,
        });
      });
  }

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      this.setState({
        modalShow: true,
        crop: row,
      })
    }
  };

  render() {
    let modalClose = () => {
      this.setState({ modalShow: false });
    }

    return (
      <div className="col-lg-12 pt-6 pb-3">
        <AddCrop />
        <div className="table-responsive mt-3">
          <BootstrapTable keyField='name' rowEvents={ this.rowEvents } data={ this.state.crops } columns={ this.state.columns } />
        </div>
        <EditCropModal show={this.state.modalShow} crop={this.state.crop} onHide={modalClose}/>
      </div>
    );
  }
};

class AddCrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
    }
  }

  render() {
    let modalClose = () => {
      this.setState({ modalShow: false });
    }

    return (
      <>
        <Button style={{'background-color': 'transparent', 'border-color': '#fff'}}
          onClick={() => this.setState({ modalShow: true })} >
          <img src={add} alt="Edit" width="24" height="24"/>
        </Button>

        <EditCropModal show={this.state.modalShow} onHide={modalClose}/>
      </>
    );
  }
}

class EditCropModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    let crop = {};

    if (typeof this.props.crop !== 'undefined') {
      crop.id = this.props.crop.id;
    }

    crop.name = data.get('name');
    crop.numSqFt = data.get('numSqFt');
    crop.initDay = data.get('initDay');
    crop.initKc = data.get('initKc');
    crop.initN = data.get('initN');
    crop.initP = data.get('initP');
    crop.initK = data.get('initK');
    crop.initFreq = data.get('initFreq');
    crop.devDay = data.get('devDay');
    crop.devKc = data.get('devKc');
    crop.devN = data.get('devN');
    crop.devP = data.get('devP');
    crop.devK = data.get('devK');
    crop.devFreq = data.get('devFreq');
    crop.midDay = data.get('midDay');
    crop.midKc = data.get('midKc');
    crop.midN = data.get('midN');
    crop.midP = data.get('midP');
    crop.midK = data.get('midK');
    crop.midFreq = data.get('midFreq');
    crop.lateDay = data.get('lateDay');
    crop.lateKc = data.get('lateKc');
    crop.lateN = data.get('lateN');
    crop.lateP = data.get('lateP');
    crop.lateK = data.get('lateK');
    crop.lateFreq = data.get('lateFreq');

    console.log(crop);

    fetch('http://localhost:3001/api/crops/set', {
      method: 'POST',
      body: JSON.stringify(crop),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(response => {
      console.log("Response: " + JSON.stringify(response));
      this.props.onHide();
      window.location.reload();
    });
  }

  handleDelete(event) {
    event.preventDefault();

    let { crop } = this.props;

    crop.action = 'delete';

    fetch('http://localhost:3001/api/crops/set', {
      method: 'POST',
      body: JSON.stringify(crop),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(response => {
      console.log("Response: " + JSON.stringify(response));
      this.props.onHide();
      window.location.reload();
    });

  }

  render() {
    let { crop } = this.props;

    let deleteButtonClass = 'd-none';

    if (typeof crop != 'undefined') {
      var name = crop.name;
      var numSqFt = crop.numSqFt;
      var initDay = crop.initDay;
      var initKc = crop.initKc;
      var initN = crop.initN;
      var initP = crop.initP;
      var initK = crop.initK;
      var initFreq = crop.initFreq;
      var devDay = crop.devDay;
      var devKc = crop.devKc;
      var devN = crop.devN;
      var devP = crop.devP;
      var devK = crop.devK;
      var devFreq = crop.devFreq;
      var midDay = crop.midDay;
      var midKc = crop.midKc;
      var midN = crop.midN;
      var midP = crop.midP;
      var midK = crop.midK;
      var midFreq = crop.midFreq;
      var lateDay = crop.lateDay;
      var lateKc = crop.lateKc;
      var lateN = crop.lateN;
      var lateP = crop.lateP;
      var lateK = crop.lateK;
      var lateFreq = crop.lateFreq;

      deleteButtonClass = 'btn btn-outline-danger';
    }

    return (
      <Modal {...this.props} size="lg" aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Crop
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formCropName">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" name="name" defaultValue={name} required/>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="formDate">
                  <Form.Label>Plants / SqFt</Form.Label>
                  <Form.Control type="number" name="numSqFt" defaultValue={numSqFt} required/>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-2">
              </div>
              <div className="col" align="center">
                <h5>Crop Stages, Coefficients &amp; Nutrients</h5>
              </div>
            </div>

            <div className="row">
              <div className="col-2">
              </div>
              <div className="col" align="center">
                <Form.Label>Days</Form.Label>
              </div>
              <div className="col" align="center">
                <Form.Label>Kc</Form.Label>
              </div>
              <div className="col" align="center">
                <Form.Label>N</Form.Label>
              </div>
              <div className="col" align="center">
                <Form.Label>P</Form.Label>
              </div>
              <div className="col" align="center">
                <Form.Label>K</Form.Label>
              </div>
              <div className="col" align="center">
                <Form.Label>Frequency</Form.Label>
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-2">
                <Form.Label>Initial</Form.Label>
              </div>
              <div class="col">
                <Form.Control type="number" name="initDay" defaultValue={initDay} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="initKc" defaultValue={initKc} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="initN" defaultValue={initN} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="initP" defaultValue={initP} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="initK" defaultValue={initK} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="initFreq" defaultValue={initFreq} required/>
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-2">
                <Form.Label>Early</Form.Label>
              </div>
              <div class="col">
                <Form.Control type="number" name="devDay" defaultValue={devDay} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="devKc" defaultValue={devKc} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="devN" defaultValue={devN} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="devP" defaultValue={devP} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="devK" defaultValue={devK} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="devFreq" defaultValue={devFreq} required/>
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-2">
                <Form.Label>Middle</Form.Label>
              </div>
              <div class="col">
                <Form.Control type="number" name="midDay" defaultValue={midDay} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="midKc" defaultValue={midKc} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="midN" defaultValue={midN} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="midP" defaultValue={midP} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="midK" defaultValue={midK} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="midFreq" defaultValue={midFreq} required/>
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-2">
                <Form.Label>Late</Form.Label>
              </div>
              <div class="col">
                <Form.Control type="number" name="lateDay" defaultValue={lateDay} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="lateKc" defaultValue={lateKc} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="lateN" defaultValue={lateN} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="lateP" defaultValue={lateP} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="lateK" defaultValue={lateK} required/>
              </div>
              <div class="col">
                <Form.Control type="number" name="lateFreq" defaultValue={lateFreq} required/>
              </div>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-primary mr-auto" variant="primary" type="submit">Submit</Button>
            <Button className="btn btn-outline-secondary" onClick={this.props.onHide}>Cancel</Button>
            <Button className={deleteButtonClass} onClick={this.handleDelete}>Delete</Button>
          </Modal.Footer>
        </Form>;
      </Modal>
    );
  }
}



class AdvancedSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: {},
      crops: [],
    };

    this.handlePracticeChange = this.handlePracticeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    var practices = [
      { value: 0, label: "Sustainable" }, { value: 1, label: "Organic" }, { value: 2, label: "Biodynamic" },
    ];

    fetch('http://localhost:3001/api/crops/get')
      .then(crops => crops.json())
      .then(crops => {
        fetch('http://localhost:3001/api/location/get')
          .then(location => location.json())
          .then(location => {
            let selectedPractice;
            for (var i = 0; i < practices.length; i++) {
              if (practices[i].value == location.practice) {
                selectedPractice = practices[i];
                break;
              }
            }

            this.setState({
              location: location,
              practices: practices,
              crops: crops,
              selectedPractice: selectedPractice,
            });
          });
      });
  }

  handlePracticeChange(practice) {
    this.setState({
      selectedPractice: practice,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    fetch('http://localhost:3001/api/practice/set', {
      method: 'POST',
      body: JSON.stringify({ practice: data.get('practice') }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(response => {
      console.log("Response: " + JSON.stringify(response));
      window.location.reload();
    });
  }

  render() {
    console.log(this.state.selectedEtr);
    console.log(this.state.selectedState);

    return (
      <>
        <h4 className="my-4">Practices</h4>
        <Form onSubmit={this.handleSubmit}>
          <div className="row mb-4">
            <div className="col-8">
              <h5>Sustainable, Organic or Biodynamic</h5>
              <p>
                Definitions for these practices can be contentious and variable. But in short, if you employ one of these practices, Vegable will take them to mean:
                <ul>
                  <li><strong>Sustainable</strong>: You follow good environmental stewardship. You use synthetic fertilizers, pesticides and fungicides ONLY sparingly.</li>
                  <li><strong>Organic</strong>: You look to improve the environment. You don't use any synthetic fertiliers, pesticides or fungicides. You control pest and disease with minimal applications of natural products.</li>
                  <li><strong>Biodynamic</strong>: You follow a holistic, ecological approach to gardening. You use biodiversity and environmental conditions to control pests and disease. </li>
                </ul>
              </p>
              <p>
                Choose which practice Vegable should follow.
              </p>
              <Form.Group controlId="formPractice">
                <Select name="practice" options={this.state.practices} onChange={practice => this.handlePracticeChange(practice)}
                  defaultValue={this.state.selectedPractice} value={this.state.selectedPractice}/>
              </Form.Group>
            </div>
          </div>

          <Button className="btn btn-primary mr-auto" variant="primary" type="submit"> Submit </Button>
        </Form>
        <div class="row justify-content-between pt-3">
          <div class="col-lg-12 pt-3 pb-6">
            <h3>Crops</h3>
              <CropsTable />
          </div>
        </div>
      </>
    );
  }
}

class Settings extends Component {
  render() {
    var headerTitles = { title: "Settings", subtitle: "Profile, Practices & Crops" };

    return (
      <div className="with-iconav">
        <IconNav />
        <div className="container">
          <DashHead {...headerTitles}/>

          <Tabs defaultActiveKey="basic" id="indexTabs">
            <Tab eventKey="basic" title="Basic">
              <BasicSettings />
            </Tab>
            <Tab eventKey="advanced" title="Advanced">
              <AdvancedSettings />
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}
export default Settings
