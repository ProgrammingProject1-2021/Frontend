import React, { useRef, useState } from 'react'
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';

const styles = {
    backgroundImage: `url(/images/background.jpg)`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh'
};


export default function Main() {
    return (
        <div className="main-page">
            <div className="row">
                <div className="navbar">
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
                        <Navbar.Brand href="/main">CHS</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                                <Navbar.Collapse id="responsive-navbar-nav">
                                    <Nav className="mr-auto">
                                        <Nav.Link href="/booking">Map/Book Vehicle</Nav.Link>
                                        <Nav.Link href="/returnvehicle">Return Vehicle</Nav.Link>
                                        <Nav.Link href="/dashboard">View History</Nav.Link>
                                        <Nav.Link href="#profile">Edit Profile</Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
            <div className="row">
                <div className="main-content" style={styles}>
                    <div className="main-page-header">
                        <div className="col-md-12">
                            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                                <h1 style={{color: 'white'}}>Welcome to CHS: car hiring service</h1>
                            </div>
                        </div>         
                    </div>
                </div>
            </div>
        </div>
    );
}