import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo.png';
import { Category } from "./home/Category";

export const Footer = () => {
    return (
        <div id="Footers">
            <div id="logo" name='logo'><img src={logo} height={50} width={120} alt="logo"/></div>
            <div id="more-info">
                <div id="products">
                    <hr/>
                    <h5>Products</h5>
                    <Link id="button" to={`/category/?name=Electric`}>Acoustic guitars</Link>
                    <Link id="button" to={`/category/?name=Acoustic`}>Electric guitars</Link>
                    <Link id="button" to={`/category/?name=Bass`}>Bass guitars</Link>
                    <Link id="button" to={`/category/?name=Amps`}>Amplifiers</Link>
                    <Link id="button" to={`/accessory/?name=Pedals`}>Pedals</Link>
                </div>
                <div id="company">
                    <hr/>
                    <h5>Company</h5>
                    <Link id="button">About us</Link>
                    <Link id="button">Contact us</Link>
                </div>
                <div id="customer-service">
                    <hr/>
                    <h5>Customer Service</h5>
                    <Link id="button">Support</Link>
                    <Link id="button">Warranty</Link>
                </div>
            </div>
            <div id="socials">
                <a href="https://youtube.com" target='_blank' rel="noreferrer"><button><i className="fa-brands fa-youtube fa-2xl"></i></button></a>
                <a href="https://tiktok.com" target='_blank' rel="noreferrer"><button><i className="fa-brands fa-tiktok fa-2xl"></i></button></a>
                <a href="https://facebook.com" target='_blank' rel="noreferrer"><button><i className="fa-brands fa-facebook fa-2xl"></i></button></a>
                <a href="https://twitter.com" target='_blank' rel="noreferrer"><button><i className="fa-brands fa-twitter fa-2xl"></i></button></a>
            </div>
            <div id="footer">
                <hr/>
                <p>© Created by Dennis Tomno</p>
            </div>
        </div>
    );
}; 