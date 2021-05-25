import { Form, notification, Input } from 'antd'
import axios from 'axios'
import router from 'next/router'
import React, { useRef, useState } from 'react'
import { ApiEndpoint } from '../constant/api'
import { BookingHour } from '../types/index'
import Navigation from '../components/navigation'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

type bookinghourform = {
  booking_id: string
  registration: string
  customer_id: string
  start_time: string
  end_time: string
}

type BookingPageProps = {
  bookinghour: BookingHour[]
}

export default function BookingHourPage({ bookinghour }: BookingPageProps) {
  const [searchState] = useState({
    searchText: '',
    searchedColumn: '',
  })
  const searchInputEl = useRef(null)
  const [form] = Form.useForm<bookinghourform>()

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  }

  async function TimeRelatedForm() {
    await form.validateFields()
    const { booking_id, registration, customer_id, start_time, end_time } = form.getFieldsValue()
    const values = {
      Booking_id: booking_id,
      Registration: registration,
      Customer_id: customer_id,
      Start_time: start_time,
      End_time: end_time,
    }

    try {
      console.log('sending data', values)
      await axios.post(ApiEndpoint.booking, values)
      router.reload()
    } catch ({ message }) {
      console.error('Error booking values', message)
      notification.error({
        message: 'Action failed',
        description: message,
      })
    }
    //}
  }
  return (
    <>
      <Navigation />
      <div style={{ marginTop: '5%' }} />

      <div className="container pt-4 pb-3">
        <Form form={form} onFinish={TimeRelatedForm}>
          <div className="form-group">
            <div className="row">
              <div className="col-lg-4">
                <label htmlFor="booking_id">Booking ID:</label>
                <Form.Item name="booking_id">
                  <Input id="booking_id" placeholder="Booking_ID" className="form-control" required />
                </Form.Item>
              </div>
              <div className="col-lg-4">
                <label htmlFor="registration">Registration:</label>
                <Form.Item name="registration">
                  <Input id="registration" placeholder="Registration" className="form-control" required />
                </Form.Item>
              </div>
              <div className="col-lg-4">
                <label htmlFor="customer_id">Customer ID:</label>
                <Form.Item name="customer_id">
                  <Input id="customer_id" placeholder="Customer_ID" className="form-control" required />
                </Form.Item>
              </div>
              <div className="col-lg-4">
                <Form.Item name="start_time" label="Start Time">
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
                <Form.Item name="end_time" label="End Time">
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
