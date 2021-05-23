import { Form, DatePicker, TimePicker, Button, notification, Space, Table, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import axios from 'axios';
import router from 'next/router';
import React, { useRef, useState } from 'react'
import { ApiEndpoint } from '../constant/api'
import { BookingHour, BookingResponse } from '../types/index'
import Highlighter from 'react-highlight-words'

type bookinghourform = {
  booking_id: string
  registration : string
  customer_id : string
  start_time : string
  end_time : string
}

type BookingPageProps = {
  bookinghour: BookingHour[]
}

export default function BookingHourPage({bookinghour}: BookingPageProps) {


  const [searchState, setSearchState] = useState({
    searchText: '',
    searchedColumn: '',
  })
  const searchInputEl = useRef(null)
  const [form] = Form.useForm<bookinghourform>()


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
  };
  
  const config = {
    rules: [
      {
        type: 'object',
        required: true,
        message: 'Please select time!',
      },
    ],
  };
  const rangeConfig = {
    rules: [
      {
        type: 'array',
        required: true,
        message: 'Please select time!',
      },
    ],
  };



  async function TimeRelatedForm() {
    await form.validateFields()
    const { booking_id, registration, customer_id, start_time, end_time } = form.getFieldsValue()
    const values =
      {
        Booking_id : booking_id,
        Registration : registration,
        Customer_id : customer_id,
        Start_time : start_time,
        End_time: end_time,
      }

      try 
      {
        console.log('sending data', values)
        await axios.post(ApiEndpoint.booking, values)
        router.reload()
      } catch ({ message }) 
      {
        console.error('Error booking values', message)
        notification.error({
          message: 'Action failed',
          description: message,
        })
      }
    //}
  }
  return (
    <div className="container pt-4 pb-3">
      <h1>Please enter a start time and end time</h1>
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
              <Form.Item name="Start_time" label="Start Time">
              <DatePicker showTime format="YYYY-MM-DD HH:mm" />
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <Form.Item name="End_time" label="End Time">
              <DatePicker showTime format="YYYY-MM-DD HH:mm" />
              </Form.Item>
            </div>
          </div>
          <div className="text-right pt-2">
            <button type="submit" className="btn btn-primary btn-w200 m-1">Book</button>
          </div>
        </div>
      </Form>
    </div>
  )
}

