import React, { useRef, useState } from 'react'
import { Navbar, Nav, Container, Col, Row} from 'react-bootstrap';
import Link from 'next/link'


export default function Returnpage({vehicles}) {
    console.log(vehicles)
    const data = vehicles
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
            <h1>Please select your booked vehicle</h1>
            <div className="row mt-5">
                <div className="col-md-12">
                    <div style={{justifyContent:'center', alignItems:'center', height: '100vh'}}>
                        <a className ="card">
                            {(() => {
                                switch (Object.keys(vehicles).length) {
                                    case 0:   return <Link href="/main">
                                                        <div className="vehicle-return-null">
                                                            <h5>No booking has been made.</h5>
                                                        </div>
                                                     </Link>
                                    default:      return <Link href="/vehiclesedit">
                                                            <div className="vehicle-return">
                                                                <Container>
                                                                    <Row>
                                                                        <Col xs lg="3">
                                                                            <img className="image"
                                                                                width="215"
                                                                                height="155"
                                                                                // TODO: use url from database {'url'} so its not hardcoded, not now but after demo due to backend is not updated.
                                                                                src="https://images.unsplash.com/photo-1597404294360-feeeda04612e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                                                            ></img>
                                                                        </Col>
                                                                        <Col xs lg="9">
                                                                            { Object.keys(data.Item).map((key, i) => (
                                                                                <p key={i}>
                                                                                    <span>{key}: </span>
                                                                                    <span>{data.Item[key]}</span>
                                                                                </p>         
                                                                            ))}
                                                                        </Col>
                                                                    </Row>
                                                                </Container>
                                                            </div>
                                                         </Link>
                                }
                            })()}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStaticProps = async () => {
    /**
    *TODO: Need to append current user at the back of the API link. for eg: ..../VehicleAPI?Current_customer={'username'}
    */
    const res = await fetch('https://ekfj8gcvhh.execute-api.ap-southeast-2.amazonaws.com/test/VehicleAPI/098765')
    const vehicles = await res.json()
    return {
        props: {
            vehicles
        }
    }
}

