import React, { useEffect, useState } from 'react'
import { StorageKey } from '../constant/storage'
import { useRouter } from 'next/router'

export default function Navigation() {
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedAdmin: boolean = localStorage.getItem(StorageKey.ADMIN) === 'true'
    setIsAdmin(storedAdmin)
  }, [])

  const onLogout = async () => {
    localStorage.setItem(StorageKey.EMAIL, '')
    localStorage.setItem(StorageKey.ADMIN, '')
    await router.push('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3 justify-content-between">
      <a className="navbar-brand" href="#">
        CHS
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/booking">
              Map/Book Vehicle
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/returnvehicle">
              Return Vehicle
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/history">
              View History
            </a>
          </li>
          {isAdmin && (
            <li className="nav-item">
              <a className="nav-link" href="/vehicle">
                Add Vehicle
              </a>
            </li>
          )}
          <li className="nav-item">
            <a className="nav-link" href="/profile">
              Profile
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <div className="nav-link" style={{ cursor: 'pointer' }} onClick={onLogout}>
              Logout
            </div>
          </li>
        </ul>
      </div>
    </nav>
  )
}
