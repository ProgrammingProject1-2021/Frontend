export type Location = {
  Name: string
  Location_latitude: number
  Location_longitude: number
}

export type Vehicle = {
  Model: string
  Registration: string
  Current_customer: string
  Location_name: string
}

export type VehicleResponse = {
  Items: Vehicle[]
  Count: number
}

export type LocationsResponse = {
  Items: Location[]
  Count: number
}
