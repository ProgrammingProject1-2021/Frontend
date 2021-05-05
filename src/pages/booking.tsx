import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, notification, Space, Table } from 'antd'
import axios from 'axios'
import router from 'next/router'
import React, { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { ApiEndpoint } from '../constant/api'
import { Vehicle, VehicleResponse } from '../types/vehicle'

type BookingPageProps = {
  vehicles: Vehicle[]
}

export default function BookingPage({ vehicles }: BookingPageProps) {
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

  async function handleBooking(carId: string) {
    try {
      const { data: responseData } = await axios.put(ApiEndpoint.vehicle + carId, { customerName: 'North' })
      console.log('Booking response', responseData)
      notification.success({
        message: 'Booking Successful',
      })

      // Wait 2 seconds before reloading the page
      setTimeout(() => {
        router.reload()
      }, 2000)
    } catch ({ message }) {
      console.error('Error sending booking request', message)
      notification.error({
        message: 'Booking Unsuccessful',
        description: message,
      })
    }
  }

  // Begin functions used for table searching
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
  // End functions used for table searching

  return (
    <div className="container pt-4 pb-3">
      <img className="img-fluid mb-3" src="/images/mock-map.png" />
      <Table columns={columns} dataSource={vehicles} rowKey={(row) => row.id} />
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await axios.get<VehicleResponse>(ApiEndpoint.vehicle)

  console.log('Response data', res.data)

  return {
    props: {
      vehicles: res.data.Items,
    },
  }
}
