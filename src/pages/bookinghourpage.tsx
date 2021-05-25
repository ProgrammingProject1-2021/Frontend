import { Form, notification, Input } from 'antd'
import axios from 'axios'
import router from 'next/router'
import React, { useState } from 'react'
import { ApiEndpoint } from '../constant/api'
import { BookingHour } from '../types/index'
import Navigation from '../components/navigation'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { uuid } from 'uuidv4'
import { GetServerSidePropsContext } from 'next'
import dayjs from 'dayjs'

type BookingHourform = {
  bookingId: string
  registration: string
  customerEmail: string
  startTime: Date
  endTime: Date
}

type BookingHourPageProps = {
  bookingId: string
  registration: string
}

export default function BookingHourPage(props: BookingHourPageProps) {
  const [form] = Form.useForm<BookingHourform>()

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  async function onFormSubmit() {
    await form.validateFields()
    const { bookingId, registration, customerEmail, startTime, endTime } = form.getFieldsValue()
    const values = {
      Booking_id: bookingId,
      Registration: registration,
      CustomerEmail: customerEmail,
      Start_time: dayjs(startTime).toISOString(),
      End_time: dayjs(endTime).toISOString(),
    }

    try {
      console.log('sending data', values)
      await axios.post(ApiEndpoint.booking, values)
      router.reload()
    } catch ({ message }) {
      console.error('Error booking values', message)
      notification.error({
        message: 'Booking Failed',
        description: message,
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
                  <Input id="bookingId" placeholder={props.bookingId} className="form-control" disabled />
                </Form.Item>
              </div>
              <div className="col-lg-4">
                <label htmlFor="registration">Registration:</label>
                <Form.Item name="registration">
                  <Input id="registration" placeholder={props.registration} className="form-control" disabled />
                </Form.Item>
              </div>
              <div className="col-lg-4">
                <label htmlFor="customerId">Customer Email:</label>
                <Form.Item name="customerId">
                  <Input id="customerId" placeholder="Customer Email" className="form-control" required />
                </Form.Item>
              </div>
              <div className="col-lg-4">
                <Form.Item name="startTime" label="Start Time">
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
                <Form.Item name="endTime" label="End Time">
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
  const registration = ctx.query?.registration

  return {
    props: {
      bookingId: uuid(),
      registration,
    },
  }
}
