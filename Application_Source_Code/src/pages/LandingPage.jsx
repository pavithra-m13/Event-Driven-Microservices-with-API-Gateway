import React, { useContext, useEffect, useState } from 'react';
import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';
import Footer from './Footer';


const LandingPage = () => {
  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);  // Modal for available flights
  const [selectedFlight, setSelectedFlight] = useState(null); // Store selected flight for view details

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userType') === 'admin') {
      navigate('/admin');
    } else if (localStorage.getItem('userType') === 'flight-operator') {
      navigate('/flight-admin');
    }
  }, []);

  const fetchFlights = async () => {
    if (checkBox) {
      if (departure !== "" && destination !== "" && departureDate && returnDate) {
        const date = new Date();
        const date1 = new Date(departureDate);
        const date2 = new Date(returnDate);
        if (date1 > date && date2 > date1) {
          setError("");
          await axios.get('http://localhost:6001/fetch-flights').then(
            (response) => {
              setFlights(response.data);
              setShowSearchModal(false); // Close search modal after submitting
              setShowFlightModal(true); // Open flight modal after search
            }
          );
        } else { 
          setError("Please check the dates"); 
        }
      } else { 
        setError("Please fill all the inputs"); 
      }
    } else {
      if (departure !== "" && destination !== "" && departureDate) {
        const date = new Date();
        const date1 = new Date(departureDate);
        if (date1 >= date) {
          setError("");
          await axios.get('http://localhost:6001/fetch-flights').then(
            (response) => {
              setFlights(response.data);
              setShowSearchModal(false); // Close search modal after submitting
              setShowFlightModal(true); // Open flight modal after search
            }
          );
        } else { 
          setError("Please check the dates"); 
        }
      } else { 
        setError("Please fill all the inputs"); 
      }
    }
  };
  

  const { setTicketBookingDate } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');

  const handleTicketBooking = async (id, origin, destination) => {
    if (userId) {
      if (origin === departure) {
        setTicketBookingDate(departureDate);
        navigate(`/book-flight/${id}`);
      } else if (destination === departure) {
        setTicketBookingDate(returnDate);
        navigate(`/book-flight/${id}`);
      }
    } else {
      navigate('/auth');
    }
  };

  const handleModalClose = () => {
    setShowFlightModal(false); // Close the flight modal
    setSelectedFlight(null);    // Clear selected flight
  };

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight); // Open the modal with selected flight details
  };

  const handleSearchModalOpen = () => {
    setShowSearchModal(true);
  };

  const handleSearchModalClose = () => {
    setShowSearchModal(false);
  };

  return (
    <div className="landingPage">
      <div className="landingHero">
        <div className="landingHero-title">
        <h1 className="text text-1">Your Journey Awaits—Find, Book, and Take Off!</h1>
      <p className="text text-2">
        Explore endless destinations, unlock exclusive deals, and make your dream journey a reality.
      </p>
      <p className="text text-3">
        Wherever you want to go, start your adventure here!
      </p>
        </div>

        {/* Centered Button to open the search modal */}
        <div className="centered-btn">
          <button className="btn btn-primary search-flights-btn" onClick={handleSearchModalOpen}>Search Flights</button>
        </div>

        {/* Modal for entering search details */}
        {showSearchModal && (
          <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content">
              <span className="close" onClick={handleSearchModalClose}>&times;</span>
              <h2>Enter Flight Search Details</h2>
              <div className="form-floating">
                <select className="form-select" value={departure} onChange={(e) => setDeparture(e.target.value)}>
                  <option value="" selected disabled>Select Departure City</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Pune">Pune</option>
                  <option value="Trivendrum">Trivendrum</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>
              <div className="form-floating">
                <select className="form-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
                  <option value="" selected disabled>Select Destination City</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Pune">Pune</option>
                  <option value="Trivendrum">Trivendrum</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>
              <div className="form-floating mb-3">
                <input type="date" className="form-control" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
                <label>Journey date</label>
              </div>
              {checkBox && 
                <div className="form-floating mb-3">
                  <input type="date" className="form-control" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                  <label>Return date</label>
                </div>
              }
              <button className="btn btn-primary" onClick={fetchFlights}>Search</button>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Modal for displaying available flights */}
        {showFlightModal && flights.length > 0 && (
          <div className="modal" style={{ display: 'block' }}>
            <div className="modal-content flight-modal">
              <span className="close" onClick={handleModalClose}>&times;</span>
              <h2>Available Flights</h2>
              <div className="availableFlightsContainer">
                {flights.filter(flight => 
                  (checkBox ? 
                    (flight.origin === departure && flight.destination === destination) || 
                    (flight.origin === destination && flight.destination === departure) 
                  : (flight.origin === departure && flight.destination === destination))
                ).map(flight => (
                  <div className="flight" key={flight._id}>
                                        <p>Flight Name: {flight.flightName}</p>
                    <button className="btn btn-primary" onClick={() => handleViewDetails(flight)}>View Details</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Flight Details Modal (Pop-up) */}
{/* Flight Details Modal (Pop-up) */}
{selectedFlight && (
  <div className="modal" style={{ display: 'block' }}>
    <div className="modal-content">
      <span className="close" onClick={handleModalClose}>&times;</span>
      <h2>Flight Details</h2>
      <p><span className="label">Flight Name:</span> <span className="detail-value">{selectedFlight.flightName}</span></p>
      {/* <p><strong>Flight ID:</strong> {selectedFlight._id}</p> */}
      <p><span className="label">Origin:</span> <span className="detail-value">{selectedFlight.origin}</span></p>
      <p><span className="label">Destination:</span> <span className="detail-value">{selectedFlight.destination}</span></p>
      <p><span className="label">Price:</span> <span className="detail-value">₹{selectedFlight.basePrice}</span></p>
      <p><span className="label">Seats Available:</span> <span className="detail-value">{selectedFlight.totalSeats}</span></p>
      <button className="btn btn-success" onClick={() => handleTicketBooking(selectedFlight._id, selectedFlight.origin, selectedFlight.destination)}>Book Now</button>
    </div>
  </div>
)}


      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
