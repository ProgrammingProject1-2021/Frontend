import { Form, Input, notification } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import { GetServerSidePropsContext } from 'next'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { uuid } from 'uuidv4'
import Navigation from '../components/navigation'
import { ApiEndpoint } from '../constant/api'
import { StorageKey } from '../constant/storage'

type BookingHourform = {
  startTime: Date
  endTime: Date
}

type BookingHourPageProps = {
  bookingId: string
  model: string
  registration: string
  locationName: string
}

export default function BookingHourPage({ bookingId, model, registration, locationName }: BookingHourPageProps) {
  const [form] = Form.useForm<BookingHourform>()

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    setEmail(localStorage.getItem(StorageKey.EMAIL))
  }, [])

  async function onFormSubmit() {
    await form.validateFields()
    const { startTime, endTime } = form.getFieldsValue()
    if (!startTime || !endTime) {
      notification.error({
        message: 'Please choose start time and end time',
        placement: 'bottomRight',
      })
      return
    }

    const vehiclePayload = {
      Model: model,
      Registration: registration,
      Current_customer: email,
      Location_name: locationName,
    }

    const bookingPayload = {
      Booking_id: bookingId,
      Customer_id: email,
      Registration: registration,
      Current_customer: email,
      Start_time: dayjs(startTime).toISOString(),
      End_time: dayjs(endTime).toISOString(),
    }

    try {
      console.log('Sending vehicle data', vehiclePayload)
      const { data: vehicleRes } = await axios.patch(`${ApiEndpoint.vehicle}/${registration}`, vehiclePayload)
      console.log('Vehicle response', vehicleRes)

      console.log('Sending booking data', bookingPayload)
      const { data: bookingRes } = await axios.post(ApiEndpoint.booking, bookingPayload)
      console.log('Booking response', bookingRes)

      notification.success({
        message: 'Booking Successful',
        placement: 'bottomRight',
      })
      // Wait 2 seconds
      setTimeout(() => {
        router.push('/main')
      }, 2000)
    } catch ({ message }) {
      console.error('Error booking values', message)
      notification.error({
        message: 'Booking Failed',
        description: message,
        placement: 'bottomRight',
      })
    }
  }
  return (
    <>
      <Navigation />
      <div style={{ marginTop: '5%' }} />

      <div className="container pt-4 pb-3">
        <Form form={form} onFinish={onFormSubmit}>
          <div className="form-group">
            <div className="row">
              <div className="col-lg-4">
                <label htmlFor="bookingId">Booking ID:</label>
                <Form.Item name="bookingId">
                  <Input id="bookingId" placeholder={bookingId} className="form-control" disabled />
                </Form.Item>
              </div>
              <div className="col-lg-4">
                <label htmlFor="registration">Registration:</label>
                <Form.Item name="registration">
                  <Input id="registration" placeholder={registration} className="form-control" disabled />
                </Form.Item>
              </div>
              <div className="col-lg-4">
                <label htmlFor="customerId">Customer Email:</label>
                <Form.Item name="customerId">
                  <Input id="customerId" placeholder={email} className="form-control" disabled />
                </Form.Item>
              </div>
              <div className="col-lg-4">
                <Form.Item name="startTime" label="Start Time" required>
                  <DatePicker
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    timeInputLabel="Time:"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeInput
                    minDate={new Date()}
                  />
                </Form.Item>
              </div>
              <div className="col-lg-4">
                <Form.Item name="endTime" label="End Time" required>
                  <DatePicker
                    className="form-control"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    timeInputLabel="Time:"
                    dateFormat="dd/MM/yyyy HH:mm"
                    showTimeInput
                    minDate={new Date()}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="text-right pt-2">
              <button type="submit" className="btn btn-primary btn-w200 m-1">
                Book
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const model = ctx.query?.model
  const registration = ctx.query?.registration
  const locationName = ctx.query?.location_name

  return {
    props: {
      bookingId: uuid(),
      model,
      registration,
      locationName,
    },
  }
}
