import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Booking Successful!</h2>
                <p style={styles.message}>Your flight has been booked successfully.</p>
                <button style={styles.button} onClick={() => navigate('/')}>
                    Go to Home
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    title: {
        color: '#4CAF50',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    message: {
        fontSize: '18px',
        margin: '10px 0',
    },
    button: {
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
    }
};

export default Success;
