import React from 'react'
import moment from 'moment'
import InputMoment from 'input-moment'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import queryString from  'query-string'
import EventGuest from './EventGuest'
import AddGuestForm from './AddGuestForm'

export default class EditEvent extends React.Component {
  constructor() {
    super()
    this.state = {
      eid: '',
      eventName: '',
      eventDateTime: moment(),
      eventHost: '',
      voteCutOffDateTime: moment(),
      eventDataToUpdate: {},
      inviteesDetails: [],
      eventInvitees: [],
      newGuestsEmails: [null],
      newGuestsNames: [null]
    }
  }

  //// START FETCH AND PROCESS DATA
  getEventUsers(eventInviteeUids) {
    let payload = {
      params: {eventInvitees: eventInviteeUids}
    }
    console.log('fetching user data for:', payload)
    return Axios.get('/getGroupInvitedUsersDetails', payload).then(resp => resp.data)
  }
  getEventDetail(eid) {
    return Axios.get(`/getSingleEvent?eid=${eid}`).then(resp => resp.data)
  }
  makeMoment(dateTime) {
    let cutOffDateArr = dateTime.split(' ')
    let cutOfftimeArr = cutOffDateArr[4].split(':')
    return moment()
      .month(cutOffDateArr[1])
      .date(cutOffDateArr[2])
      .hour(cutOfftimeArr[0])
      .minute(cutOfftimeArr[1])
      .second(cutOfftimeArr[2])
  }
  processFetchedData(event) {
    event.voteCutOffDateTime = this.makeMoment(event.voteCutOffDateTime)
    event.eventDateTime = this.makeMoment(event.eventDateTime)
    this.getEventUsers(Object.keys(event.eventInvitees))
    .then(inviteesDetails => {
      event.inviteesDetails = inviteesDetails
      this.setState(event, () => console.log('state', this.state))
    }) 
  }
  componentDidMount(){
    let parsedEid = queryString.parse(location.search).eventKey
    console.log('event id: ', parsedEid)
    this.getEventDetail(parsedEid)
    .then(eventDetails => this.processFetchedData(eventDetails))
  }

  ////START HTTP PUT AND PROCESS DATA
  updatePutObj(eventPropToUpdate, value) {
    this.setState(prevState => {
      let eventDataToUpdate = Object.assign({}, prevState.eventDataToUpdate)
      eventDataToUpdate[eventPropToUpdate] = value
      return {eventDataToUpdate: eventDataToUpdate}
    }, () => console.log(this.state))
  }
  addAnotherGuestForm() {
    this.setState(prevState => ({newGuestsEmails: [...prevState.newGuestsEmails, null]}))
  }
  addNewGuestToState(email, name, idx) {
    this.setState(prevState => {
      let updatedGuestsEmails = prevState.newGuestsEmails.slice()
      let updatedGuestsNames = prevState.newGuestsNames.slice()
      updatedGuestsEmails[idx] = email
      updatedGuestsNames[idx] = name
      console.log(updatedGuestsEmails, updatedGuestsNames, idx)
      return {newGuestsEmails: updatedGuestsEmails, newGuestsNames: updatedGuestsNames}
    })
  }
  handleTitleChange({ target }){
    this.setState({eventName: target.value})
    this.updatePutObj.call(this, 'eventName', target.value)  
  }
  handleInputMoment(dateTime) {
    this.setState({voteCutOffDateTime: dateTime })
    this.updatePutObj.call(this, 'voteCutOffDateTime', dateTime.format('llll'))
  }
  submitForm() {
    let fieldsToUpdate = Object.assign({}, this.state.eventDataToUpdate)
    if (this.state.newGuestsEmails[0] !== null) {
      fieldsToUpdate.yelpResultsCount = this.state.eventHost[Object.keys(this.state.eventHost)[0]].length
      //if the user left an empty field, we remove it from our payload
      if (this.state.newGuestsEmails[this.state.newGuestsEmails.length - 1] === null) {
        this.state.newGuestsEmails.pop()
      }
      fieldsToUpdate.newGuests = [this.state.newGuestsEmails, this.state.newGuestsNames]
    }
    let payload = {eid: this.state.eid, fieldsToUpdate: fieldsToUpdate}
    Axios.put('/editEvent', payload)
      .then((resp) => console.log(resp.data))
      .catch(err => console.log('Edit Event Form Submission Error: ', err));

    let inviteEmailParamsObject = {
      emails: this.state.newGuestsEmails,
      hostName: this.state.eventHost,
      eventDate: this.state.eventDateTime,
      eventName: this.state.eventName,
      eventId: this.state.eid
    }
    Axios.post('/sendInviteEmailEditEvent', inviteEmailParamsObject)
      .then((response) => console.log("sending invite email to new guests :", response))
      .catch((err) => console.log("error in sending invite emails to new guests :", err))  
  }
  ////END HTTP PUT AND PROCESS DATA
  deleteEvent(){
    let payload = { params: {
      eid: this.state.eid,
      uid: Object.keys(this.state.eventHost)[0], 
      inviteeuids: Object.keys(this.state.eventInvitees),
      yelpresultsid: this.state.yelpSearchResultsKey
      }
    }
    Axios.delete('/deleteEvent', payload)
    .then(() => {this.props.history.push('/account')})
  }

  render(){
    const dateTime = this.state.eventDateTime;
    return (
      <div className="editEventForm parent">
      <div className="form-edit-event">
        <div className="form-event-name inputs">

	        <h1 className="editEventFormCurrentTitle">
	        	Edit: {this.state.eventName}
	        </h1>
	        <h2 className="editEventFormCurrentDateTime">
	        	{dateTime.format('MMM [the] Do [of] YYYY')} at {dateTime.format('h:mm a')}
	        </h2>
          <p className="edit-page-message">If you would like to change the event time please create a <Link to="/inputForm" style={{ textDecoration: 'underline', color: 'blue'}}>new event</Link>.</p>
	        <label>
	          New Name:
	          <input 
	            type="text"
	            name="eventName"
	            placeholder="Name your outing!"
	            value={this.state.eventName}
	            onChange={this.handleTitleChange.bind(this)}
	          />
	        </label>
        </div>
        
        <div className="form-date-time-cutoff" className="inputs">
          <label>
            New Cutoff Time:
          <InputMoment
            moment={this.state.voteCutOffDateTime}
            onChange={m => this.handleInputMoment.call(this, m)}
            minStep={10}
            />
          </label>
        </div>

        <div className="editFormRemoveGuests">
        	<h3 className="editFormRemoveGuestsText">
        		Guests:
        	</h3>
          <table> 
          <tbody>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Remove</th>
            </tr>
              {this.state.inviteesDetails.map((userDetails, idx) => <EventGuest details={userDetails} key={idx}/>)}
            </tbody>
          </table>
        	<button className="editFormRemoveGuestsButton">Remove Select</button>
        </div>
        <div className="editFormAddGuests">
            {this.state.newGuestsEmails.map((guest, idx) => <AddGuestForm key={idx} idx={idx} addNewGuestToState={this.addNewGuestToState.bind(this)} /> )}
        </div>
        <button onClick={this.addAnotherGuestForm.bind(this)} >Add Another </button>


        <div className="editFormSaveChanges">
        	<button className="editFormSaveChangesButton" onClick={this.submitForm.bind(this)}>Save Changes</button>
        </div>

        <div className="editFormDeleteEvent">
        	<button className="editFormDeleteEventButton" onClick={this.deleteEvent.bind(this)}>Delete Event</button>
        </div>
        
      	</div>
     </div>
    )
  }
}