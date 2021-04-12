import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, notification, Space, Table } from 'antd'
import axios from 'axios'
import router from 'next/router'
import React, { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { API_ENDPOINT } from '../constant/api'

type Vehicle = {
  id: string
  carModel: string
  registration: string
  customerName: string
}

type VehiclePageProps = {
  vehicles: Vehicle[]
}

export default function VehiclePage({ vehicles }: VehiclePageProps) {
  const columns = [
    {
      title: 'Model',
      dataIndex: 'carModel',
      ...getColumnSearchProps('carModel'),
    },
    {
      title: 'Registration',
      dataIndex: 'registration',
      ...getColumnSearchProps('registration'),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      ...getColumnSearchProps('customerName'),
    },
  ]

  const [searchState, setSearchState] = useState({
    searchText: '',
    searchedColumn: '',
  })
  const searchInputEl = useRef(null)
  const [form] = Form.useForm<Vehicle>()

  function getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInputEl}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
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
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}>
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
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value: string, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : '',
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
