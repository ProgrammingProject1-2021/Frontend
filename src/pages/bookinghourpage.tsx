import { Form, DatePicker, TimePicker, Button, notification, Space, Table, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import axios from 'axios';
import router from 'next/router';
import React, { useRef, useState } from 'react'
import { ApiEndpoint } from '../constant/api'
import { BookingHour, BookingResponse } from '../types/vehicle'
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
  const columns = [
    {
      title: 'Booking_id',
      dataIndex: 'Booking_id',
      ...getColumnSearchProps('Booking_id'),
    },
    {
      title: 'Registration',
      dataIndex: 'Registration',
      ...getColumnSearchProps('Registration'),
    },
    {
      title: 'Customer_id',
      dataIndex: 'Customer_id',
      ...getColumnSearchProps('Customer_id'),
    },
    {
      title: 'Start_time',
      dataIndex: 'Start_time',
      ...getColumnSearchProps('Start_time'),
    },
    {
      title: 'End_time',
      dataIndex: 'End_time',
      ...getColumnSearchProps('End_time'),
    },
  ]

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

  async function TimeRelatedForm() {
    await form.validateFields()
    //const onFinish = async (fieldsValue: { [x: string]: { format: (arg0: string) => any; }; }) => {
    const { booking_id, registration, customer_id, start_time, end_time } = form.getFieldsValue()
    const values =
      {
        Booking_id : booking_id,
        Registration : registration,
        Customer_id : customer_id,
        Start_time : start_time,
        End_time: end_time,
        //'Start_time': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm'),
       // 'End_time': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm'),
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
      <Form form={form} onFinish={TimeRelatedForm}>
        <div className="form-group">
          <div className="row">
            <div className="col-lg-4">
              <label htmlFor="booking_id">Booking_ID</label>
              <Form.Item name="booking_id">
                <Input id="booking_id" placeholder="Booking_ID" className="form-control" required />
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <label htmlFor="registration">Registration</label>
              <Form.Item name="registration">
                <Input id="registration" placeholder="Registration" className="form-control" required />
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <label htmlFor="customer_id">Customer_ID</label>
              <Form.Item name="customer_id">
                <Input id="customer_id" placeholder="customer_id" className="form-control" required />
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <label htmlFor="start_time">start_time</label>
              <Form.Item name="start_time">
                <Input id="start_time" placeholder="start_time" className="form-control" required />
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <label htmlFor="end_time">end_time</label>
              <Form.Item name="end_time">
                <Input id="end_time" placeholder="end_time" className="form-control" required />
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
      <Table columns={columns} dataSource={bookinghour} rowKey="id" />
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await axios.get<BookingResponse>(ApiEndpoint.booking)

  const vehiclesRes = res.data

  return {
    props: {
      vehicles: vehiclesRes.Items,
    },
  }
}