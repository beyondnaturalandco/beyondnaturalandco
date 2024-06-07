import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { CiFacebook } from "react-icons/ci";

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <div className="footer-content-logo">
            <img src={assets.logowhite} alt="" />
          </div>
          <p>When you walk in to work every day, you will find that the energy on the floor is just amazing at Janosa. The passion, the hunger, the drive to excel is so infectious, it brings the best out in everyone.</p>
          <div className="footer-social-icons">
            <a href='https://www.facebook.com/profile.php?id=61556948297729&mibextid=ZbWKwL' target='_blank' rel='noopener noreferrer'>
              <CiFacebook size={50} />
            </a>


          </div>
        </div>
        <div className="footer-content-center">
          <h2>Beyond</h2>
          <ul>
            <li><a href='#'>Home</a></li>
            <li>About</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91-9951221593</li>
            <li><a href="/">BeyondNatural.com</a></li>
          </ul>
        </div>
      </div>
      <hr />
      <p className='footer-copyright'>Copyright 2024 © BeyondNatural.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
