import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section company-details">
        <h3>Company Name</h3>
        <p>123 Main St, Suite 100</p>
        <p>Nungambakkam, TamilNadu, 600039</p>
        <p>Phone: (123) 456-7890</p>
        <p>Email: info@company.com</p>
      </div>
      
      <div className="footer-section about">
        <h3>About Us</h3>
        <p>We are a travel company committed to providing the best travel experiences and services. Book your flights with us for a hassle-free experience!</p>
      </div>
      
      <div className="footer-section contact">
        <h3>Contact Us</h3>
        <p>Feel free to reach out via phone, email, or visit our office for any queries.</p>
      </div>
      
      <div className="footer-section social">
        <h3>Follow Us</h3>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
