import {useState} from 'react';
import './App.css';
import FlightIcon from './assets/flight-icon.png';


function FlightBooking() {
  // your code here
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [when, setWhen] = useState('');
  const [flightRes, setFlightRes] = useState([]);
  const [selFlight, setSelFlight] = useState(null);
  const [showBookForm, setBookForm] = useState(false);
  const [showConfirmForm, setConfirmForm] = useState(false);
   
  const getFlightDetails = () => {
    fetch('/flights').then(response => response.json())
    .then(response => {
      setFlightRes(response)
    })
  }

  const handleBookNow = (id) =>{
    setSelFlight(id);
    setBookForm(true);
  }

  const submitBooking = (udetails) => {
    const {name, email} = udetails;
    const postData = {
      name,
      email,
      flight: selFlight
    }
    fetch('/booking', {method: 'POST', body:postData})
    .then(response => response.json())
    .then(result => {
      if(result.message === 'Successful!'){
        setConfirmForm(true);
        setBookForm(false);
      }
    })
  }

  return (
    <div>
      <h1 data-testid='Flight Booking'>Flight Booking</h1>
      <div className='search-bar'>
          <InputForm label='Source' value={source} placeholder='Source' eleId='source' handle={setSource}/>
          <InputForm label='Destination' value={destination} placeholder='Destination' eleId='destination' handle={setDestination}/>
          <InputForm label='when' value={when} placeholder='when' eleId='when' handle={setWhen}/>
          <button name="Search Flight" onClick={getFlightDetails} data-testrole='button'>Search Flight</button>
      </div>
      <div className='search-list'>
          {flightRes.length === 0 ? <span>Search for a flight!</span> : 
           <FlightList {...flightRes[0]} handleBookNow={handleBookNow}/>
          }
      </div>
      {showBookForm && <BookingForm submitBooking={submitBooking} /> }
      {showConfirmForm && <ConfirmationForm closeForm={()=>{setConfirmForm(false)}}/>}
    </div>
  );
}

const InputForm = (props) => {
  return (
    <span>
      <label>{props.label}</label>
      <input type='text' defaultValue={props.value} placeholder={props.placeholder} data-testid={props.eleId} onChange={(e)=>{props.handle(e.target.value)}}/>
    </span>
  );
}

const FlightList = (props) => {
  return (
    <div className='search-flight'>
      <img src={FlightIcon} className='icon' />
      <div className='details'>
        <h1>{props.arrival}</h1>
        <p data-testid='company'>{props.company}</p>
      </div>
      <div className='duration'>
        <h1>{`${props.duration} mins`}</h1>
        <p>{`${props.source.key}-${props.destination.key}`}</p>
      </div>
      <div className='price'>
        <h1 data-testid='price'>{`₹ ${props.price}`}</h1>
      </div>
      <button data-testid='booknow' role='button' onClick={()=>{props.handleBookNow(props.id)}}>Booknow</button>
  </div>  
  )
}

const BookingForm = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('')
  return (
    <div className='booknow-frm'>
      <div className='container'>
      <input type='text' defaultValue={name} placeholder='Your Name' data-testid='name' onChange={(e)=>{setName(e.target.value)}}/>
      <input type='text' defaultValue={email} placeholder='Your Email' data-testid='email'  onChange={(e)=>{setEmail(e.target.value)}}/>
      <button data-testid='confirm_booking' role='button' onClick={()=>{
        props.submitBooking({name, email});
      }}>Confirm Booking</button>
      </div>
    </div>
  );
}

const ConfirmationForm = (props) => {
  return (
    <div className='booknow-frm'>
      <div className='container'>
        <p data-testid='result'>Booking Confirmed!</p>
        <button onClick={props.closeForm} role='button'>Close</button>
      </div>
    </div>
  )
}

export default FlightBooking;
