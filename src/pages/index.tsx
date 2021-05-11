import axios from 'axios'
import router from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ApiEndpoint } from '../constant/api'

interface IRegistrationInputs {
  email: string
  name: string
  password: string
  confirmPassword: string
}

function Register() {
  const [errorMsg, setErrorMsg] = useState('')
  const { register, handleSubmit } = useForm<IRegistrationInputs>()

  async function onSubmit(data: IRegistrationInputs) {
    const { email, name, password, confirmPassword } = data

    if (password !== confirmPassword) {
      setErrorMsg('Password mismatch')
      return
    }

    try {
      await axios.post(ApiEndpoint.register, {
        Email: email,
        Name: name,
        Password: password,
        Admin: "false",
      })
    } catch (e) {
      console.error('Error registering', e)
      setErrorMsg(e.message)
    }
  }

  return (
    <div className="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Registration Form
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {errorMsg && (
                <div className="alert alert-danger" role="alert">
                  {errorMsg}
                </div>
              )}

              <label>Email</label>
              <input {...register('email')} type="email" className="form-control mb-3" placeholder="Email" required />

              <label>Name</label>
              <input {...register('name')} type="text" className="form-control mb-3" placeholder="Name" required />

              <label>Password</label>
              <input
                {...register('password')}
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                required
              />
              <label>Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="form-control mb-3"
                placeholder="Confirm Password"
                required
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

interface ILoginInputs {
  email: string
  password: string
}

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit } = useForm<ILoginInputs>()

  async function onSubmit(data: ILoginInputs) {
    const { email, password } = data

    try {
      await axios.post(ApiEndpoint.login, {
        Email: email,
        Password: password,
      })

      router.push({
        pathname: 'booking',
      })
    } catch (e) {
      console.error('Error logging in', e)
      setErrorMsg(e.message)
    }
  }

  return (
    <>
      <div className="sidenav">
        <div className="login-main-text">
          <h2>
            Application
            <br /> Login Page
          </h2>
          <p>Login or register from here to access.</p>
        </div>
      </div>
      <div className="main">
        <div className="col-md-6 col-sm-12">
          <div className="login-form">
            {errorMsg && (
              <div className="alert alert-danger" role="alert">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Email</label>
                <input {...register('email')} type="email" className="form-control" placeholder="Email" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input {...register('password')} type="password" className="form-control" placeholder="Password" />
              </div>
              <button type="submit" className="btn btn-black mr-3">
                Login
              </button>
              <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>

      <Register />
    </>
  )
}
