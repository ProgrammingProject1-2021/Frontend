import { Form, Input, notification, Row, Table } from 'antd'
import axios from 'axios'
import React from 'react'
import { API_ENDPOINT } from '../constant/api'
import router from 'next/router'

type Vehicle = {
  id: string
  carModel: string
  registration: string
  customerName: string
}

const columns = [
  {
    title: 'Model',
    dataIndex: 'carModel',
  },
  {
    title: 'Registration',
    dataIndex: 'registration',
  },
  {
    title: 'Customer Name',
    dataIndex: 'customerName',
  },
]

type VehiclePageProps = {
  vehicles: Vehicle[]
}

export default function VehiclePage({ vehicles }: VehiclePageProps) {
  const [form] = Form.useForm<Vehicle>()

  async function handleSubmit() {
    await form.validateFields()

    const { carModel, registration, customerName } = form.getFieldsValue()

    try {
      // Send data to backend
      await axios.post(API_ENDPOINT.vehicle, {
        carModel,
        registration,
        customerName,
      })
      router.reload()
    } catch ({ message }) {
      console.error('Error sending vehicle info', message)
      notification.error({
        message: 'Adding new vehicle failed',
        description: message,
      })
    }
  }

  return (
    <div className="container pt-4 pb-3">
      <Form form={form} onFinish={handleSubmit}>
        <div className="form-group">
          <div className="row">
            <div className="col-lg-4">
              <label htmlFor="carModel">Car Model</label>
              <Form.Item name="carModel">
                <Input
                  id="carModel"
                  placeholder="Car Model"
                  className="form-control"
                  required
                />
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <label htmlFor="registration">Registration</label>
              <Form.Item name="registration">
                <Input
                  id="registration"
                  placeholder="Registration"
                  className="form-control"
                  required
                />
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <label htmlFor="customerName">Customer Name</label>
              <Form.Item name="customerName">
                <Input
                  id="customerName"
                  placeholder="customerName"
                  className="form-control"
                  required
                />
              </Form.Item>
            </div>
          </div>

          <div className="text-right pt-2">
            <button type="submit" className="btn btn-primary btn-w200 m-1">
              Add new vehicle
            </button>
          </div>
        </div>
      </Form>

      <Table columns={columns} dataSource={vehicles} rowKey={(row) => row.id} />
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await axios.get(API_ENDPOINT.vehicle)

  const vehicles = res.data

  return {
    props: {
      vehicles,
    },
  }
}
