import React from 'react'
import Navigation from '../components/navigation'

const styles = {
  backgroundImage: `url(/images/background.jpg)`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '100vh',
}

export default function Main() {
  return (
    <div className="main-page">
      <Navigation />
      <div className="row">
        <div className="main-content" style={styles}>
          <div className="main-page-header">
            <div className="col-md-12">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1 style={{ color: 'white' }}>Welcome to CHS: car hiring service</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
