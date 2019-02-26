import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FullCalendar from 'fullcalendar-reactwrapper';
import Select from 'react-select';
import DateTime from "react-datetime";
import 'react-datetime/css/react-datetime.css';

import moment from 'moment';

import { IconNav } from '../molecules/IconNav';
import DashHead from '../organisms/DashHead';

import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';

import '../../assets/css/bootstrap-table.css';
import '../../assets/css/bootstrap-select.css';
import '../../assets/css/toolkit-light.css';
import '../../assets/css/application.css';

let zones = [];
let repeatDays = [
  { value: 'Sunday', label: 'Sunday' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'None', label: 'None' },
];

class Calendar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalShow: false,
      defaultDate: new Date(),
      event: [],
      events: [],
    }
    this.handleEventClick = this.handleEventClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/zones/get')
      .then(zoneList => zoneList.json())
      .then(zoneList => {
        zones = zoneList;

        let start = moment().subtract(1, 'months').format("YYYY-MM-DD");
        let end = moment().add(1, 'months').format("YYYY-MM-DD");
        fetch(`http://localhost:3001/api/events/get?start=${start}&end=${end}`)
          .then(events => events.json())
          .then(events => {
            this.setState({
              events: events,
            });
      });
    });
  }

  handleEventClick (event, jsEvent, view) {
    this.setState({
      modalShow: true,
      event: event,
    });
  }

  handleSelect (start, end) {
    this.setState({
      modalShow: true,
      event: { start: start, repeatEnd: end },
    });
  }

  render() {
    let modalClose = () => {
      this.setState({ modalShow: false });
    }

    return (
      <div className="col-lg-12 py-6">
        <FullCalendar id='fullCalendar'
          header={{ left: 'title', center: 'month,agendaWeek,agendaDay', right: 'prev,next,today' }}
          defaultDate={new Date()} editable={true} selectable={true} selectHelper={true}
          events={ this.state.events } eventLimit={true}
          select={this.handleSelect} eventClick={this.handleEventClick}/>
        <EditEventModal show={this.state.modalShow} event={this.state.event} onHide={modalClose}/>
      </div>
    );
  }
};

class EditEventModal extends Component {
  constructor(props) {
    super(props);

    let eventDate;
    let repeatEnd;

    if (typeof props.event === 'undefined') {
      eventDate = new Date();
      repeatEnd = new Date();
    } else {
      eventDate = props.event.start;
      repeatEnd = props.event.repeatEnd;
    }
    this.state = {
      eventDate: moment(eventDate).format("MM/DD/YYYY hh:mm A"),
      repeatEnd: moment(eventDate).format("MM/DD/YYYY"),
    };

    this.handleEventDateChange = this.handleEventDateChange.bind(this);
    this.handleRepeatEndChange = this.handleRepeatEndChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.event !== this.props.event && this.props.event != null) {
      this.setState({
        eventDate: moment(this.props.event.start).format("MM/DD/YYYY hh:mm A"),
        repeatEnd: moment(this.props.event.repeatEnd).format("MM/DD/YYYY"),
      });
    }
  }

  handleEventDateChange(eventDate) {
    this.setState({
      eventDate: eventDate,
    });
  }

  handleRepeatEndChange(repeatEnd) {
    this.setState({
      repeatEnd: repeatEnd,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);

    let event = {};

    if (typeof this.props.event !== 'undefined') {
      event.id = this.props.event.id;
    }

    event.title = data.get('title');
    event.zid = data.get('zid');
    event.amt = data.get('amt');
    event.fertilize = data.get('fertilize');

    event.start = moment(this.state.eventDate).format("MM/DD/YYYY hh:mm A");

    event.repeatDow = data.get('repeatDow');
    event.repeatEnd = moment(this.state.repeatEnd).format("MM/DD/YYYY");

    console.log(event);

    fetch('http://localhost:3001/api/events/set', {
      method: 'POST',
      body: JSON.stringify(event),
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

  handleDelete(e) {
    e.preventDefault();

    let event = {};

    event.id = this.props.event.id;
    event.action = 'delete';

    console.log(event);

    fetch('http://localhost:3001/api/events/set', {
      method: 'POST',
      body: JSON.stringify(event),
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

    let { event } = this.props;

    let title;
    let zone;
    let amt;
    let fertilize = false;
    let eventDate = moment().format('MM/DD/YYYY');
    let eventRepeatEnd;

    let deleteButtonClass = 'd-none';

    if (typeof event != 'undefined' && event != null) {
      title = event.title;
      amt = event.amt;
      fertilize = true;

      for (let i = 0; i < zoneList.length; i++) {
        if (zoneList[i].value == event.zid) {
          zone = zoneList[i];
          break;
        }
      }

      eventDate = moment(event.start).format('MM/DD/YYYY hh:mm A');
      eventRepeatEnd = moment(event.repeatEnd).format('MM/DD/YYYY');

      if (event.id) {
        deleteButtonClass = 'btn btn-outline-danger';
      }
    }

    return (
      <Modal {...this.props} size="lg" aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Event
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
            </div>
            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formEventDate">
                  <Form.Label>Start</Form.Label>
                  <DateTime name="start" defaultValue={eventDate} value={this.state.eventDate}
                    onChange={this.handleEventDateChange}/>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-6">
                <Form.Group controlId="formZone">
                  <Form.Label>Zone</Form.Label>
                  <Select name="zid" options={zoneList} defaultValue={zoneList[0]} value={zone} required/>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="formAmount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control name="amt" type="number" defaultValue={amt} required/>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="formFertilize">
                  <Form.Label>Fertilize</Form.Label>
                  <Form.Control name="fertilize" type="checkbox" defaultValue={fertilize}/>
                </Form.Group>
              </div>
            </div>

            <div className="row mb-4">
            </div>

            <div className="row mb-4">
              <div className="col">
                <Form.Group controlId="formZone">
                  <Form.Label>Repeat</Form.Label>
                  <Select name="repeatDow" options={repeatDays} defaultValue={repeatDays[7]} required/>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="formRepeatEndDate">
                  <Form.Label>Repeat End</Form.Label>
                  <DateTime name="repeatEnd" defaultValue={eventRepeatEnd} value={this.state.eventRepeatEnd}
                    onChange={this.handleRepeatEndChange}/>
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

class Events extends Component {

  render() {
    let headerTitles = { title: "Schedule", subtitle: "Days and Times when Zones will be running" };

    return (
      <>
        <div className="with-iconav">
          <IconNav />
          <div className="container">
            <DashHead {...headerTitles}/>

            <hr className="mt-5 mb-4" />

            <div className="row justify-content-between">
              <Calendar />
            </div>

          </div>

        </div>
      </>
    )
  }
}
export default Events
