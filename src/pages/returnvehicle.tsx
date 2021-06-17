import { notification } from 'antd'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Navigation from '../components/navigation'
import { ApiEndpoint } from '../constant/api'
import { StorageKey } from '../constant/storage'
import { Vehicle, VehicleResponse } from '../types'

export default function Returnpage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    async function fetchApi() {
      const email = localStorage.getItem(StorageKey.EMAIL)
      try {
        const vehicleRes = await axios.get<VehicleResponse>(`${ApiEndpoint.vehicle}?Current_customer=${email}`)

        console.log('vehicle response', vehicleRes)

        setVehicles(vehicleRes?.data?.Items)
      } catch (error) {
        const message = error?.response ? error?.response?.data?.message : error.message

        notification.error({
          message: 'Error',
          description: message,
          placement: 'bottomRight',
        })
      }
    }

    fetchApi()
  }, [])

  return (
    <div className="main-page">
      <Navigation />

      <h1>Please select your booked vehicle</h1>
      <div className="row mt-5">
        <div className="col-md-12">
          <div style={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="card">
              {(() => {
                switch (vehicles.length) {
                  case 0:
                    return (
                      <Link href="/main">
                        <div className="vehicle-return-null">
                          <h5>No booking has been made.</h5>
                        </div>
                      </Link>
                    )
                  default:
                    return (
                      <div className="vehicle-return">
                        <div className="container">
                          {vehicles.map(({ Registration: regis, Model: model }, i) => (
                            <Link href={`/vehiclesedit?${regis}`}>
                              <div className="row mt-4">
                                <div className="col-md-3">
                                  <img
                                    className="img-fluid image"
                                    width="215"
                                    height="155"
                                    // TODO: use url from database {'url'} so its not hardcoded, not now but after demo due to backend is not updated.
                                    src="https://images.unsplash.com/photo-1597404294360-feeeda04612e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"></img>
                                </div>
                                <div className="col-md-9">
                                  <div className="d-flex flex-column">
                                    <span>{regis}</span>
                                    <span>{model}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
