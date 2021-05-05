import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Location } from '../types'

const containerStyle = {
  width: '100%',
  height: '50vh',
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

type MapViewProps = {
  locations: Location[]
  handleMarker: (loc: string) => void
}

export default function MapView({ locations, handleMarker }: MapViewProps) {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        {locations.map((loc) => (
          <Marker
            key={loc.Name}
            title={loc.Name}
            // label="My Marker"
            position={{
              lat: loc.Location_latitude,
              lng: loc.Location_longitude,
            }}
            onClick={() => handleMarker(loc.Name)}
          />
        ))}

        {/* <InfoWindow position={center}>
          <div style={divStyle}>
            <h1>InfoWindow</h1>
          </div>
        </InfoWindow> */}
      </GoogleMap>
    </LoadScript>
  )
}
