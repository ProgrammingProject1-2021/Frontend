import React, { useRef, useState } from 'react'
import { Navbar, Nav} from 'react-bootstrap';

export default function Returnpage({vehicles}) {
    return (
        <div className="main-page">
            <div className="row">
                <div className="navbar">
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
                        <Navbar.Brand href="/">CHS</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                                <Navbar.Collapse id="responsive-navbar-nav">
                                    <Nav className="mr-auto">
                                        <Nav.Link href="#map">Map/Book Vehicle</Nav.Link>
                                        <Nav.Link href="/returnvehicle">Return Vehicle</Nav.Link>
                                        <Nav.Link href="/dashboard">View History</Nav.Link>
                                        <Nav.Link href="#profile">Edit Profile</Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
            <h1>Returing Vehicle</h1>
         </div>
    );
}


