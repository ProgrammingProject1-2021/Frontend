import React from 'react'
import Navigation from '../components/navigation'
import { Form, Input, notification } from 'antd'
import axios from 'axios'
import { ApiEndpoint } from '../constant/api'
import { StorageKey } from '../constant/storage'
import router from 'next/router'

type ChangePasswordForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function Returnpage() {
  const [form] = Form.useForm<ChangePasswordForm>()

  async function onFormSubmit() {
    await form.validateFields()
    const { newPassword, confirmPassword } = form.getFieldsValue()

    if (newPassword !== confirmPassword) {
      notification.error({
        message: 'Password mismatch',
        placement: 'bottomRight',
      })
      return
    }

    try {
      // todo: correct api endpoint
      const { data: responseData } = await axios.patch(ApiEndpoint.register, {
        Email: localStorage.getItem(StorageKey.EMAIL),
        Password: newPassword,
      })
      console.log('responseData', responseData)

      notification.success({
        message: 'Booking Successful',
        placement: 'bottomRight',
      })
      // Wait 2 seconds
      setTimeout(() => {
        router.push('/main')
      }, 2000)
    } catch ({ message }) {
      console.error('Error changing password', message)
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

      <div className="container">
        <div className="card col-md-6">
          <div className="card-body">
            <h3>Change Password</h3>

            <Form form={form} onFinish={onFormSubmit}>
              <div className="form-group">
                <div className="mt-4 row">
                  <div className="col-md-12">
                    <label htmlFor="currentPassword">Current Password:</label>
                    <Form.Item name="currentPassword">
                      <Input
                        id="currentPassword"
                        placeholder="Current Password"
                        className="form-control"
                        type="password"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <label htmlFor="newPassword">New Password:</label>
                    <Form.Item name="newPassword">
                      <Input id="newPassword" placeholder="New Password" className="form-control" type="password" />
                    </Form.Item>
                  </div>
                  <div className="col-lg-6">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <Form.Item name="confirmPassword">
                      <Input
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        className="form-control"
                        type="password"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Change
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
