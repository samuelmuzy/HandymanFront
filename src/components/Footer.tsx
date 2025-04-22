import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import logoCasa1 from '../assets/logoCasa1.png';
import '../App.css'; // Garante que o CSS global seja aplicado

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-right">
        <img src={logoCasa1} alt="logoCasa1" className="footer-logo" />
      </div>
      <div className="social-icons">
        <a href="https://www.facebook.com/seuPerfil" target="_blank" rel="noopener noreferrer" className="icon-link">
          <FaFacebookF />
        </a>
        <a href="https://www.instagram.com/seuPerfil" target="_blank" rel="noopener noreferrer" className="icon-link">
          <FaInstagram />
        </a>
        <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="icon-link">
          <FaWhatsapp />
        </a>
        <a href="https://twitter.com/seuPerfil" target="_blank" rel="noopener noreferrer" className="icon-link">
          <FaTwitter />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
