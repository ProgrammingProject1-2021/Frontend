import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'

const containerStyle = {
  width: '100vw',
  height: '100vh',
}

const center = {
  lat: -37.840935,
  lng: 144.946457,
}

const divStyle = {
  background: `white`,
  border: `1px solid #ccc`,
  padding: 15,
}

export default function MapView() {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        <Marker
          title="My Marker"
          // label="My Marker"
          position={{
            lat: -37.840935,
            lng: 144.946457,
          }}
        />
        {/* <InfoWindow position={center}>
          <div style={divStyle}>
            <h1>InfoWindow</h1>
          </div>
        </InfoWindow> */}
      </GoogleMap>
    </LoadScript>
  )
}
