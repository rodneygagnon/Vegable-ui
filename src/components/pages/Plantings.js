import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BootstrapTable from 'react-bootstrap-table-next';
import Select from 'react-select';
import DateTime from "react-datetime";
import 'react-datetime/css/react-datetime.css';

import moment from 'moment';

import { IconNav } from '../molecules/IconNav';
import DashHead from '../organisms/DashHead';

import '../../assets/css/bootstrap-table.css';
import '../../assets/css/bootstrap-select.css';
import '../../assets/css/toolkit-light.css';
import '../../assets/css/application.css';

import add from '../../assets/img/icons/add.svg';

let zones = [];
let crops = [];

class PlantingsTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalShow: false,
      planting: [],
      plantings: [],
      columns: [
        {
          dataField: 'id',
          iskey: true,
          hidden: true,
        },
        {
          dataField: 'date',
          text: 'Planting Date',
          sort: true,
          formatter: function (value) {
            const started = (value == 0 ? '' : moment(value).format('MM/DD/YYYY'));
            return (<span>{started}</span>);
          }
        },
        {
          dataField: 'title',
          text: 'Title',
          sort: true
        },
        {
          dataField: 'zid',
          text: 'Zone',
          sort: true,
          formatter: function (value) {
            let zone = value;
            for (let i = 0; i < zones.length; i++) {
              if (zones[i].id === value) {
                zone = zones[i].name;
                break;
              }
            }
            return (<span>{zone}</span>);
          },
        },
        {
          dataField: 'area',
          text: 'Area (sqft)',
          sort: true,
          formatter: function (value, row) {
            let area = 0;
            for (let i = 0; i < crops.length; i++) {
              if (crops[i].id === row.cid) {
                area = row.count / crops[i].numSqFt;
                break;
              }
            }
            return (<span>{area.toFixed(1)}</span>);
          }
        },
        {
          dataField: 'cid',
          text: 'Crop',
          sortable: true,
          formatter: function (value) {
            let crop = value;
            for (let i = 0; i < crops.length; i++) {
              if (crops[i].id === value) {
                crop = crops[i].name;
                break;
              }
            }
            return (<span>{crop}</span>);
          }
        },
        {
          dataField: 'count',
          text: 'Count',
          sort: true,
        }
      ],
    }
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/zones/get/planting')
      .then(plantingZones => plantingZones.json())
      .then(plantingZones => {
        zones = plantingZones;
        fetch('http://localhost:3001/api/crops/get')
          .then(cropList => cropList.json())
          .then(cropList => {
            crops = cropList;
            fetch('http://localhost:3001/api/plantings/get')
              .then(plantings => plantings.json())
              .then(plantings => {
                this.setState({
                  plantings: plantings,
                });
          });
        });
      });
  }

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      this.setState({
        modalShow: true,
        planting: row,
      })
    }
  };

  render() {
    let modalClose = () => {
      this.setState({ modalShow: false });
    }

    return (
      <div className="col-lg-12 pt-6 pb-3">
        <AddPlanting />
        <div className="table-responsive mt-3">
          <BootstrapTable keyField='name' rowEvents={ this.rowEvents } data={ this.state.plantings } columns={ this.state.columns } />
        </div>
        <EditPlantingModal show={this.state.modalShow} planting={this.state.planting} onHide={modalClose}/>
      </div>
    );
  }
};

class AddPlanting extends Component {
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

        <EditPlantingModal show={this.state.modalShow} onHide={modalClose}/>
      </>
    );
  }
}

class EditPlantingModal extends Component {
  constructor(props) {
    super(props);

    let plantingDate;

    if (typeof props.planting === 'undefined') {
      plantingDate = new Date();
    } else {
      plantingDate = props.planting.date;
    }
    this.state = {
      plantingDate: moment(plantingDate).format("MM/DD/YYYY"),
    };

    this.handlePlantingDateChange = this.handlePlantingDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.planting !== this.props.planting) {
      this.setState({
        plantingDate: moment(this.props.planting.date).format("MM/DD/YYYY"),
      });
    }
  }

  handlePlantingDateChange(plantingDate) {
    this.setState({
      plantingDate: plantingDate,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    let planting = {};

    if (typeof this.props.planting !== 'undefined') {
      planting.id = this.props.planting.id;
    }

    planting.title = data.get('title');

    planting.date = moment(this.state.plantingDate).format("MM/DD/YYYY");

    planting.cid = data.get('cid');
    planting.zid = data.get('zid');
    planting.count = data.get('count');
    planting.age = data.get('age');
    planting.mad = data.get('mad');

    console.log(planting);

    fetch('http://localhost:3001/api/plantings/set', {
      method: 'POST',
      body: JSON.stringify(planting),
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

    let { planting } = this.props;

    planting.action = 'delete';

    fetch('http://localhost:3001/api/plantings/set', {
      method: 'POST',
      body: JSON.stringify(planting),
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
    let zoneList = [];
    for (let i = 0; i < zones.length; i++) {
      zoneList.push({ value: zones[i].id, label: zones[i].name });
    }

    let cropList = [];
    for (let i = 0; i < crops.length; i++) {
      cropList.push({ value: crops[i].id, label: crops[i].name });
    }

    let { planting } = this.props;

    let title;
    let zone;
    let crop;
    let age;
    let count;
    let mad;
    let plantingDate = moment().format('MM/DD/YYYY');

    let deleteButtonClass = 'd-none';

    if (typeof planting != 'undefined') {
      title = planting.title;
      count = planting.count;
      age = planting.age;
      mad = planting.mad;

      for (let i = 0; i < cropList.length; i++) {
        if (cropList[i].value == planting.cid) {
          crop = cropList[i];
          break;
        }
      }

      for (let i = 0; i < zoneList.length; i++) {
        if (zoneList[i].value == planting.zid) {
          zone = zoneList[i];
          break;
        }
      }

      plantingDate = moment(planting.date).format('MM/DD/YYYY');

      deleteButtonClass = 'btn btn-outline-danger';
    }

    return (
      <Modal {...this.props} size="lg" aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Planting
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formPlantingTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" name="title" defaultValue={title} required/>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="formDate">
                  <Form.Label>Planting Date</Form.Label>
                  <DateTime name="date" timeFormat={false} defaultValue={plantingDate} value={this.state.plantingDate}
                    onChange={this.handlePlantingDateChange}/>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formZoneArea">
                  <Form.Label>Crop</Form.Label>
                  <Select name="cid" options={cropList} defaultValue={cropList[0]} value={crop} required/>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="formZoneSWHC">
                  <Form.Label>Zone</Form.Label>
                  <Select name="zid" options={zoneList} defaultValue={zoneList[0]} value={zone} required/>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formCropCount">
                  <Form.Label>Count</Form.Label>
                  <Form.Control name="count" type="number" defaultValue={count} required/>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="formZoneFlowRate">
                  <Form.Label>Age</Form.Label>
                  <Form.Control name="age" type="text" defaultValue={age}  required/>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formCropCount">
                  <Form.Label>Maximum Allowable Depletion (%)</Form.Label>
                  <Form.Control name="mad" type="number" defaultValue={mad} required/>
                </Form.Group>
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

class Plantings extends Component {

  render() {
    let headerTitles = { title: "Plantings", subtitle: "Active Plantings" };

    return (
      <>
        <div className="with-iconav">
          <IconNav />
          <div className="container">
            <DashHead {...headerTitles}/>

            <hr className="mt-5 mb-4" />

            <div className="row justify-content-between">
              <PlantingsTable />
            </div>

          </div>

        </div>
      </>
    )
  }
}
export default Plantings
