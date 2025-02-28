import React, { useContext, useEffect, useState } from 'react';
import '../styles/BookFlight.css';
import { GeneralContext } from '../context/GeneralContext';
import { useParams, useNavigate } from 'react-router-dom';

const API_GATEWAY_URL = "https://your-id.execute-api.us-east-1.amazonaws.com/production/book-ticket";  // Replace with your API Gateway URL

const BookFlight = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Flight details
    const [flightData] = useState({
        flightName: 'Sample Flight',
        flightId: id || 'FL123',
        basePrice: 200,
        startCity: 'New York',
        destinationCity: 'Los Angeles',
        startTime: '10:00 AM',
    });

    const [formData, setFormData] = useState({
        email: '',
        mobile: '',
        coachType: '',
        journeyDate: useContext(GeneralContext).ticketBookingDate || '',
        numberOfPassengers: 0,
        passengers: [],
    });

    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const priceMultiplier = { 'economy': 1, 'premium-economy': 2, 'business': 3, 'first-class': 4 };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle passenger count change
    const handlePassengerCount = (e) => {
        const count = parseInt(e.target.value) || 0;
        setFormData({ ...formData, numberOfPassengers: count, passengers: Array(count).fill({ name: '', age: '' }) });
    };

    // Handle passenger details input
    const handlePassengerDetailsChange = (index, key, value) => {
        const updatedPassengers = [...formData.passengers];
        updatedPassengers[index] = { ...updatedPassengers[index], [key]: value };
        setFormData({ ...formData, passengers: updatedPassengers });
    };

    // Calculate total price
    useEffect(() => {
        if (formData.coachType && formData.numberOfPassengers > 0) {
            setTotalPrice(priceMultiplier[formData.coachType] * flightData.basePrice * formData.numberOfPassengers);
        }
    }, [formData.coachType, formData.numberOfPassengers, flightData.basePrice]);

    // Function to send booking request to API Gateway
    const bookFlight = async () => {
        setLoading(true);
        setError(null);

        const bookingData = {
            email: formData.email,
            mobile: formData.mobile,
            coachType: formData.coachType,
            journeyDate: formData.journeyDate,
            numberOfPassengers: formData.numberOfPassengers,
            passengers: formData.passengers,
            flightId: flightData.flightId,
            totalPrice: totalPrice,
        };

        try {
            const response = await fetch(API_GATEWAY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Booking failed. Please try again.");
            }

            alert("Booking Successful!");
            navigate('/success');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="BookFlightPage">
            <div className="BookingFlightPageContainer">
                <h2>Book Your Flight</h2>

                <div className="flight-details">
                    <p><b>Flight Name:</b> {flightData.flightName}</p>
                    <p><b>Flight No:</b> {flightData.flightId}</p>
                    <p><b>From:</b> {flightData.startCity} <b>To:</b> {flightData.destinationCity}</p>
                    <p><b>Departure Time:</b> {flightData.startTime}</p>
                    <p><b>Base Price:</b> ${flightData.basePrice}</p>
                </div>

                <form className="booking-form">
                    {/* Contact Details */}
                    <div className="form-floating">
                        <input type="email" className="form-control" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <label style={{ fontSize: '20px' }}>Email</label>
                    </div>
                    
                    <div className="form-floating">
                        <input type="text" className="form-control" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} required />
                        <label style={{ fontSize: '20px' }}>Mobile</label>
                    </div>

                    {/* Booking Details */}
                    <div className="form-floating">
                        <input type="number" className="form-control" name="numberOfPassengers" placeholder="No. of Passengers" value={formData.numberOfPassengers} onChange={handlePassengerCount} min="1" required />
                        <label>No. of Passengers</label>
                    </div>

                    <div className="form-floating">
                        <input type="date" className="form-control" name="journeyDate" placeholder="Journey Date" value={formData.journeyDate} onChange={handleChange} required />
                        <label>Journey Date</label>
                    </div>

                    <div className="form-floating">
                        <select className="form-select" name="coachType" value={formData.coachType} onChange={handleChange} required>
                            <option value="" disabled>Select Class</option>
                            <option value="economy">Economy</option>
                            <option value="premium-economy">Premium Economy</option>
                            <option value="business">Business</option>
                            <option value="first-class">First Class</option>
                        </select>
                        <label>Seat Class</label>
                    </div>

                    {/* Passenger Details */}
                    <div className="new-passengers">
                        {formData.passengers.map((_, index) => (
                            <div className="new-passenger" key={index}>
                                <h4>Passenger {index + 1}</h4>
                                <div className="new-passenger-inputs">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" placeholder="Name" value={formData.passengers[index].name} onChange={(e) => handlePassengerDetailsChange(index, 'name', e.target.value)} required />
                                        <label style={{ fontSize: '20px' }}>Name</label>
                                    </div>
                                    <div className="form-floating">
                                        <input type="number" className="form-control" placeholder="Age" value={formData.passengers[index].age} onChange={(e) => handlePassengerDetailsChange(index, 'age', e.target.value)} required />
                                        <label style={{ fontSize: '20px' }}>Age</label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Price & Submit Button */}
                    <h6><b>Total Price:</b> ${totalPrice}</h6>

                    {error && <p className="error-message">{error}</p>}

                    <button type="button" className="btn btn-primary" onClick={bookFlight} disabled={loading}>
                        {loading ? "Booking..." : "Book Now"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookFlight;
