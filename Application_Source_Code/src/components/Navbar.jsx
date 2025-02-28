import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { GeneralContext } from '../context/GeneralContext';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const navigate = useNavigate();
  const usertype = localStorage.getItem('userType');
  const { logout } = useContext(GeneralContext);

  const buttonStyles = {
    color: 'white',
    background: 'linear-gradient(45deg, #FF6B6B, #F9A826)',
    padding: '8px 20px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: '500',
    boxShadow: '0px 4px 8px rgba(249, 168, 38, 0.25)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'linear-gradient(45deg, #F97300, #FF9A00)',
      boxShadow: '0px 4px 12px rgba(249, 104, 38, 0.3)',
      transform: 'translateY(-2px)',
    },
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'white', 
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
        color: 'rgb(28, 82, 126)',
        padding: '8px 0',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 3%' }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: 70, height: 65, borderRadius:'30px', marginRight: '10px' }} /> {/* Logo */}
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgb(28, 82, 126)', 
              fontWeight: 'bold',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            {usertype === 'admin' ? ' (Admin)' :
             usertype === 'flight-operator' ? ' (Operator)' : ''}
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: '20px' }}>
          {!usertype ? (
            <>
              <Button onClick={() => navigate('/')} sx={buttonStyles}>Home</Button>
              <Button onClick={() => navigate('/auth')} sx={buttonStyles}>Login</Button>
              <Button onClick={() => navigate('/register')} sx={buttonStyles}>Register</Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/')} sx={buttonStyles}>Home</Button>
              {usertype === 'customer' && (
                <>
                  <Button onClick={() => navigate('/bookings')} sx={buttonStyles}>Bookings</Button>
                  <Button onClick={logout} sx={buttonStyles}>Logout</Button>
                </>
              )}
              {usertype === 'admin' && (
                <>
                  {/* <Button onClick={() => navigate('/admin')} sx={buttonStyles}>Home</Button> */}
                  <Button onClick={() => navigate('/all-users')} sx={buttonStyles}>Users</Button>
                  <Button onClick={() => navigate('/all-bookings')} sx={buttonStyles}>Bookings</Button>
                  <Button onClick={() => navigate('/all-flights')} sx={buttonStyles}>Flights</Button>
                  <Button onClick={logout} sx={buttonStyles}>Logout</Button>
                </>
              )}
              {usertype === 'flight-operator' && (
                <>
                  {/* <Button onClick={() => navigate('/flight-admin')} sx={buttonStyles}>Home</Button> */}
                  <Button onClick={() => navigate('/flight-bookings')} sx={buttonStyles}>Bookings</Button>
                  <Button onClick={() => navigate('/flights')} sx={buttonStyles}>Flights</Button>
                  <Button onClick={() => navigate('/new-flight')} sx={buttonStyles}>Add Flight</Button>
                  <Button onClick={logout} sx={buttonStyles}>Logout</Button>
                </>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
