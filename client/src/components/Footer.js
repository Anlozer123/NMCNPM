import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-cols">
                <div className="footer-col">
                    <h2 className="footer-logo">TÂM ANH</h2>
                    <p className="footer-desc">Tận tâm, hết mình, đẳng cấp</p>
                </div>
                <div className="footer-col">
                    <p>120 Yên Lãng - Hà Nội</p>
                    <p>Email: contact@tamanh.com</p>
                </div>
            </div>
            <div className="footer-bottom" style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '40px'}}>
                <div className="social-icons">
                    <FaLinkedinIn /> <FaFacebookF /> <FaInstagram />
                </div>
            </div>
        </footer>
    );
};

export default Footer;