import { Form, DatePicker, TimePicker, Button, notification } from 'antd'
import axios from 'axios';
import router from 'next/router';
import React, { useRef, useState } from 'react'
import { ApiEndpoint } from '../constant/api'

type bookinghourform = {
  start_time : string
  end_time : string
}



export default function BookingHourPage() {
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

  const [form] = Form.useForm<bookinghourform>()

  async function TimeRelatedForm() {
    await form.validateFields()
    const onFinish = async (fieldsValue: { [x: string]: { format: (arg0: string) => any; }; }) => {
    const { start_time, end_time } = form.getFieldsValue()
    const values =
      {
  
        'starttime-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm'),
        'endtime-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm'),
  
      }


      try {
        console.log('sending data', values)
        await axios.post(ApiEndpoint.vehicle, values)
        router.reload()
      } catch ({ message }) {
        console.error('Error booking values', message)
        notification.error({
          message: 'Action failed',
          description: message,
        })
      }
    }
  }
  return (
    <Form form={form} name="time_related_controls" {...formItemLayout} onFinish={TimeRelatedForm}>
    <h1>Please enter your start time and end time</h1>
    <Form.Item name="starttime-picker" label="Start Time">
      <DatePicker showTime format="YYYY-MM-DD HH:mm" />
    </Form.Item>

    <Form.Item name="endtime-picker" label="End Time">
      <DatePicker showTime format="YYYY-MM-DD HH:mm" />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      }}
    >
      <button type="submit" className="btn1">
        Book
      </button>
    </Form.Item>
  </Form>
  )
}