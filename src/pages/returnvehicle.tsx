import React, { useRef, useState } from 'react'
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import Link from 'next/link'


export default function Returnpage({vehicles}) {
    console.log(vehicles)
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
            <h1>Edit your booked vehicle here</h1>
            <div className="row mt-5">
                <div className="col-md-12">
                    <div style={{justifyContent:'center', alignItems:'center', height: '100vh'}}>
                        <Link href="/vehiclesedit">
                            <a className ="card">
                                { Object.keys(vehicles.Items).map((vehicle) => (
                                    <h3>{vehicle.toString()}</h3>
                                ))}
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStaticProps = async () => {
    // Need to appent current user at the back of the API link. if return null, render smtg
    const res = await fetch('https://ekfj8gcvhh.execute-api.ap-southeast-2.amazonaws.com/test/VehicleAPI')
    const vehicles = await res.json()
    return {
        props: {
            vehicles
        }
    }
}

