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
