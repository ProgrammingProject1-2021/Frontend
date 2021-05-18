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

export type BookingHour =
{
  Booking_id: string
  Registration: string
  Customer_id: string
  Start_time: string
  End_time: string
}

export type BookingResponse =
{
 Items: BookingHour[]
 Count: number
}