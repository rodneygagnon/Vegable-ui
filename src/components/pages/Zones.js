import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BootstrapTable from 'react-bootstrap-table-next';
import Select from 'react-select';
import { CirclePicker } from 'react-color';
import DateTime from "react-datetime";
import 'react-datetime/css/react-datetime.css';

import moment from 'moment';

import { IconNav } from '../molecules/IconNav';
import DashHead from '../organisms/DashHead';

import '../../assets/css/bootstrap-table.css';
import '../../assets/css/bootstrap-select.css';
import '../../assets/css/bootstrap-colorpicker.css';
import '../../assets/css/toolkit-light.css';
import '../../assets/css/application.css';

import edit from '../../assets/img/icons/edit.svg';
import power from '../../assets/img/icons/power.svg';

const zoneColors = [
  '#e91e63',
  "#3f51b5",
  "#03a9f4",
  "#009688",
  "#795548",
  "#607d8b",
];

class ControlZones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zones: [{ name: 'Control Zone', started: 0 }],
      columns: [
        {
          dataField: 'name',
          text: 'Name',
          sort: true
        },
        {
          dataField: 'started',
          text: 'Start Time',
          sort: true,
          formatter: function (value) {
            return (
              <span>
                {(value == 0 ? '' : moment(value).format('DD MMM YYYY hh:mm a'))}
              </span>
            )
          }
        },
        {
          dataField: 'actions',
          text: 'Actions',
          sort: false,
          formatter: this.cntlOperateFormatter
        }
      ],
    }
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/zones/get/control')
      .then(cntlZones => cntlZones.json())
      .then(cntlZones => {
        this.setState({
          zones: cntlZones,
        });
      });
  }

  cntlOperateFormatter(value, row) {
//    const runningStyle = (row.status ? 'svg-primary' : 'svg-secondary');
    return (
      <div className="table-icons">
        <SwitchZone zone={row}/>
     </div>
    );
  }

  render() {
    return (
      <div className="col-lg-6 pt-6 pb-3">
        <h4 className="mt-3">Control Zones</h4>
        <div className="table-responsive mt-3">
          <BootstrapTable keyField='name' data={ this.state.zones } columns={ this.state.columns } />
        </div>
      </div>
    );
  }
};

class PlantingZones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zones: [{ name: 'Planting Zone', started: 0 }],
      columns: [
        {
          dataField: 'name',
          text: 'Name',
          sort: true
        },
        {
          dataField: 'area',
          text: 'Area (sqft)',
          sort: true,
          formatter: function (value, row) {
            let soilWHC = [0.75, 1.25, 1.5, 2.0];
            let soilTypes = ['Coarse', 'Sandy', 'Medium', 'Fine'];
            for (let i = 0; i < soilWHC.length; i++) {
              if (row.swhc === soilWHC[i]) return <span>{value} ({soilTypes[i]} soil)</span>;
            }
          }
        },
        {
          dataField: 'emitterCount',
          text: 'Irrigation',
          sort: true,
          formatter: function (value, row) {
            return <span>{value} ({row.emitterRate} gph)</span>;
          }
        },
        {
          dataField: 'plantings',
          text: 'Plantings',
          align: 'center',
          sort: true,
          formatter: function (value) {
            if (typeof value === 'undefined' || value === 0) {
              return <span></span>;
            } else {
              return <a href="/plantings" className="badge badge-success">  {value}  </a>;
            }
          }
        },
        {
          dataField: 'started',
          text: 'Start Time',
          sortable: true,
          formatter: function (value) {
            return (
              <span>
                {(value == 0 ? '' : moment(value).format('DD MMM YYYY hh:mm a'))}
              </span>
            )
          }
        },
        {
          dataField: 'actions',
          text: 'Actions',
          sort: false,
          formatter: this.openOperateFormatter
        }
      ],
    };
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/zones/get/planting')
      .then(plantingZones => plantingZones.json())
      .then(plantingZones => {
        this.setState({
          zones: plantingZones,
        });
      });
  }

  openOperateFormatter(value, row) {
//    const runningStyle = (row.status ? 'svg-primary' : 'svg-secondary');

    return (
      <div className="table-icons">
        <EditZone zone={row}/>
        <SwitchZone zone={row}/>
      </div>
    );
  }

  render() {
    return (
      <div className="col-lg-12 pt-6 pb-3">
        <h4 className="mt-3">Planting Zones</h4>
        <div className="table-responsive mt-3">
          <BootstrapTable keyField='name' data={ this.state.zones } columns={ this.state.columns } />
        </div>
      </div>
    );
  }
};

class SwitchZone extends Component {
  render() {
    let switchZone = () => {
      let { zone } = this.props;
      fetch(`http://localhost:3001/api/zones/switch?id=${zone.id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(response => {
        console.log("Response: " + JSON.stringify(response));
        window.location.reload();
      });
    }

    return (
      <>
        <Button style={{'background-color': 'transparent', 'border-color': '#fff'}}
          onClick={switchZone} >
          <img src={power} alt="Edit" width="24" height="24"/>
        </Button>
      </>
    );
  }
}


class EditZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
    }
  }

  render() {
    let modalClose = () => {
      this.setState({ modalShow: false });
      console.log(this.props);
    }

    return (
      <>
        <Button style={{'background-color': 'transparent', 'border-color': '#fff'}}
          onClick={() => this.setState({ modalShow: true })} >
          <img src={edit} alt="Edit" width="24" height="24"/>
        </Button>

        <EditZoneModal show={this.state.modalShow} zone={this.props.zone} onHide={modalClose}/>
      </>
    );
  }
}

class EditZoneModal extends Component {
  constructor(props) {
    super(props);

    const times = String(props.zone.start).split(':');
    const start = new Date();
    start.setHours(times[0]);
    start.setMinutes(times[1]);

    this.state = {
      start: start,
      color: props.zone.color,
    };
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
  }

  handleStartChange(start) {
    this.setState({
      start: start,
    });
  }

  handleColorChange(color) {
    this.setState({
      color: color.hex,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    let { zone } = this.props;

    console.log('Handle Submit Called:');
    zone.name = data.get('name');

    zone.start = moment(this.state.start).format("HH:mm");

    zone.width = data.get('width');
    zone.length = data.get('length');
    zone.swhc = data.get('swhc');
    zone.emitterCount = data.get('emitterCount');
    zone.emitterRate = data.get('emitterRate');

    zone.color = this.state.color;

    console.log(zone);

    fetch('http://localhost:3001/api/zones/set', {
      method: 'POST',
      body: JSON.stringify(zone),
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
    let { zone } = this.props;

    let soilTypes = [
      { value: '0.75', label: 'Coarse' },
      { value: '1.25', label: 'Sandy' },
      { value: '1.5', label: 'Medium' },
      { value: '2.0', label: 'Fine' },
    ];

    let soilType;
    for (var i = 0; i < soilTypes.length; i++) {
      if (soilTypes[i].value == zone.swhc) {
        soilType = soilTypes[i];
        break;
      }
    }

    return (
      <Modal {...this.props} size="lg" aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Zone
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formZoneName">
                  <Form.Label >Name</Form.Label>
                  <Form.Control type="text" name="name" defaultValue={zone.name} required/>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="formZoneStart">
                  <Form.Label>Schedule Start Time</Form.Label>
                  <DateTime name="start" dateFormat={false} timeFormat={'HH:mm'} value={this.state.start}
                    onChange={this.handleStartChange}/>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formZoneArea">
                  <Form.Label>Area (W x L)</Form.Label>
                  <div className="row">
                    <div className="col">
                      <Form.Control name="width" type="text" defaultValue={zone.width} required/>
                    </div>
                    <div className="col">
                    <Form.Control name="length" type="text" defaultValue={zone.length} required/>
                    </div>
                  </div>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="formZoneSWHC">
                  <Form.Label>Soil Type</Form.Label>
                  <Select name="swhc" options={soilTypes} defaultValue={soilType} />
                </Form.Group>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formZoneEmitters">
                  <Form.Label>Emitters</Form.Label>
                  <Form.Control name="emitterCount" type="number" defaultValue={zone.emitterCount} required/>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="formZoneFlowRate">
                  <Form.Label>Flow Rate (GPH)</Form.Label>
                  <Form.Control name="emitterRate" type="text" defaultValue={zone.emitterRate}  required/>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formZoneColor">
                  <Form.Label>Zone Color</Form.Label>
                  <CirclePicker name="color" width='100%' colors={zoneColors} color={this.state.color}
                    onChangeComplete={this.handleColorChange}/>
                </Form.Group>
              </div>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-primary mr-auto" variant="primary" type="submit"> Submit </Button>
            <Button className="btn btn-outline-secondary" onClick={this.props.onHide}>Cancel</Button>
          </Modal.Footer>
        </Form>;
      </Modal>
    );
  }
}

class Zones extends Component {
  render() {
    let headerTitles = { title: "Zones", subtitle: "Current Status of Vegable Zones" };

    return (
      <>
        <div className="with-iconav">
          <IconNav />
          <div className="container">
            <DashHead {...headerTitles}/>

            <hr className="mt-5 mb-4" />

            <div className="row justify-content-between">
              <ControlZones />
            </div>

            <div className="row justify-content-between">
              <PlantingZones />
            </div>

          </div>

        </div>
      </>
    )
  }
}
export default Zones
