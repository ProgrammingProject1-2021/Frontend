import React, { useEffect, useState } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { StorageKey } from '../constant/storage'

export default function Navigation() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const storedAdmin: boolean = localStorage.getItem(StorageKey.ADMIN) === 'true'
    setIsAdmin(storedAdmin)
  }, [])

  return (
    <div className="navbar">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
        <Navbar.Brand href="/main">CHS</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/booking">Map/Book Vehicle</Nav.Link>
            <Nav.Link href="/returnvehicle">Return Vehicle</Nav.Link>
            <Nav.Link href="/dashboard">View History</Nav.Link>

            {isAdmin && <Nav.Link href="/vehicle">Add Vehicle</Nav.Link>}

            <Nav.Link href="#profile">Edit Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
