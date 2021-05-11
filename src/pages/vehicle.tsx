import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, notification, Space, Table } from 'antd'
import axios from 'axios'
import router from 'next/router'
import React, { useRef, useState } from 'react'
// @ts-ignore
import Highlighter from 'react-highlight-words'
import { ApiEndpoint } from '../constant/api'
import { Vehicle, VehicleResponse } from '../types/vehicle'

type VehicleForm = {
  model: string
  registration: string
  currentCustomer: string
  locationName: string
}

type VehiclePageProps = {
  vehicles: Vehicle[]
}

export default function VehiclePage({ vehicles }: VehiclePageProps) {
  const columns = [
    {
      title: 'Model',
      dataIndex: 'Model',
      ...getColumnSearchProps('Model'),
    },
    {
      title: 'Registration',
      dataIndex: 'Registration',
      ...getColumnSearchProps('Registration'),
    },
    {
      title: 'Current Customer',
      dataIndex: 'Current_customer',
      ...getColumnSearchProps('Current_customer'),
    },
    {
      title: 'Location Name',
      dataIndex: 'Location_name',
      ...getColumnSearchProps('Location_name'),
    },
  ]

  const [searchState, setSearchState] = useState({
    searchText: '',
    searchedColumn: '',
  })
  const searchInputEl = useRef(null)
  const [form] = Form.useForm<VehicleForm>()

  function getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInputEl}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}>
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false })
                setSearchState({
                  searchText: selectedKeys[0],
                  searchedColumn: dataIndex,
                })
              }}>
              Filter
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value: string, record) =>
        record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
      onFilterDropdownVisibleChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInputEl.current.select(), 100)
        }
      },
      render: (text: string) =>
        searchState.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchState.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    }
  }

  function handleSearch(selectedKeys, confirm, dataIndex) {
    confirm()
    setSearchState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  function handleReset(clearFilters) {
    clearFilters()
    setSearchState({ ...searchState, searchText: '' })
  }

  async function handleSubmit() {
    await form.validateFields()

    const { model, registration, currentCustomer, locationName } = form.getFieldsValue()
    const payload = {
      Model: model,
      Registration: registration,
      Current_customer: currentCustomer,
      Location_Name: locationName,
    }

    try {
      // Send data to backend
      console.log('sending data', payload)
      await axios.post(ApiEndpoint.vehicle, payload)
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
              <label htmlFor="model">Car Model</label>
              <Form.Item name="model">
                <Input id="model" placeholder="Car Model" className="form-control" required />
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <label htmlFor="registration">Registration</label>
              <Form.Item name="registration">
                <Input id="registration" placeholder="Registration" className="form-control" required />
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <label htmlFor="currentCustomer">Customer Name</label>
              <Form.Item name="currentCustomer">
                <Input id="currentCustomer" placeholder="customerName" className="form-control" required />
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <label htmlFor="locationName">Location Name</label>
              <Form.Item name="locationName">
                <Input id="locationName" placeholder="locationName" className="form-control" required />
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
      <Table columns={columns} dataSource={vehicles} rowKey="id" />
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await axios.get<VehicleResponse>(ApiEndpoint.vehicle)

  const vehiclesRes = res.data

  return {
    props: {
      vehicles: vehiclesRes.Items,
    },
  }
}
