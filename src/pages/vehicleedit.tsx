import React, { useState } from 'react'
import { useRouter } from 'next/router'
import DatePicker from 'react-datepicker'
import axios from 'axios'

import Navigation from '../components/navigation'
import { Form, notification } from 'antd'

import 'react-datepicker/dist/react-datepicker.css'
import { ApiEndpoint } from '../constant/api'
import { StorageKey } from '../constant/storage'

export default function VehicleEdit() {
  const router = useRouter()
  const [cost, setCost] = useState(-1)
  const [endDate, setEndDate] = useState(null)
  const { registration } = router.query
  const [form] = Form.useForm()

  async function onFormSubmit() {
    try {
      const email = localStorage.getItem(StorageKey.EMAIL)
      if (!email) {
        notification.error({
          message: 'Invalid credential',
          description: 'This user has no email',
          placement: 'bottomRight',
        })
        await router.replace('/login')
        return
      }

      const { data: bookingData } = await axios.get(`${ApiEndpoint.booking}?Customer_id=1`)
      console.log('booking data', bookingData)

      // const payload = { Registration: registration, Actual_end_time: endDate }
      // const response = await axios.patch(`${ApiEndpoint.booking}/${email}`, payload)
      // console.log('Returning car response', response)

      // const { Cost: _cost } = response.data
      // setCost(_cost)
    } catch ({ message }) {
      console.error('Error returning car', message)
      notification.error({
        message: 'Returning Failed',
        description: message,
        placement: 'bottomRight',
      })
    }
  }

  if (cost > 0) {
    return (
      <>
        <Navigation />

        <div className="container">
          <PaymentPrompt amount={cost} />
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />

      <div className="container">
        <div className="card col-md-5">
          <div className="card-body">
            <h5>Please select your returning date</h5>

            <div className="mt-4" />

            <Form form={form} onFinish={onFormSubmit}>
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
              <button type="submit" className="btn btn-primary btn-w200 m-1">
                Return
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}

type PaymentPromptProps = {
  amount: number
}
function PaymentPrompt({ amount }: PaymentPromptProps) {
  return (
    <div className="card col-md-5">
      <div className="card-body">
        <h5>Your payment amount is {amount}</h5>

        <div className="mt-4" />

        <button type="submit" className="btn btn-success btn-w200 m-1">
          Pay
        </button>
      </div>
    </div>
  )
}
