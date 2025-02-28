import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Authenticate from './pages/Authenticate';
import RegisterAuthenticate from './pages/RegisterAuthenticate';
import {Routes, Route} from 'react-router-dom'
import LoginProtector from './RouteProtectors/LoginProtector';
import AuthProtector from './RouteProtectors/AuthProtector';
import BookFlight from './pages/BookFlight';
import Message from  './pages/Message';


function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route exact path = '' element={<LandingPage />} />
        <Route path='/auth' element={<LoginProtector> <Authenticate /> </LoginProtector>} />
        <Route path='/book-Flight' element={<BookFlight />}/>
        <Route path='/register' element={<LoginProtector> <RegisterAuthenticate /> </LoginProtector>} />
        <Route path='/success' element={<Message/>}/>

    
      </Routes>

    </div>
  );
}

export default App;
