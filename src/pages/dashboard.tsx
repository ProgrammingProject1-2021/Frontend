import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, notification, Space, Table } from 'antd'
import axios from 'axios'
import React, { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { ApiEndpoint } from '../constant/api'
import { BookingHistory, DashboardResponse } from '../types/index'
import Navigation from '../components/navigation'

type dashboardform = {
  booking_id: string
  registration : string
  start_time : string
  end_time : string
  cost: string
}

type dashboardProps = {
  dashboard: BookingHistory[]
}

export default function dashboardPage({ dashboard }: dashboardProps) {
  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'Booking_id',
      ...getColumnSearchProps('Booking_id'),
    },
    {
      title: 'Registration',
      dataIndex: 'Registration',
      ...getColumnSearchProps('Registration'),
    },
    {
      title: 'Start Time',
      dataIndex: 'Start_time',
      ...getColumnSearchProps('Start_time'),
    },
    {
      title: 'End Time',
      dataIndex: 'End_time',
      ...getColumnSearchProps('End_time'),
    },
    {
      title: 'Total Cost',
      dataIndex: 'Cost',
      ...getColumnSearchProps('Cost'),
    },
  ]

  const [searchState, setSearchState] = useState({
    searchText: '',
    searchedColumn: '',
  })
  const searchInputEl = useRef(null)
  const [form] = Form.useForm<dashboardform>()

  function getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => 
      (
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

  function handleSearch(selectedKeys, confirm, dataIndex) 
  {
    confirm()
    setSearchState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  function handleReset(clearFilters) 
  {
    clearFilters()
    setSearchState({ ...searchState, searchText: '' })
  }

  return (
    <>
      <Navigation />
      <div style={{ marginTop: '5%' }} />
      <div className="container">
        <Table columns={columns} dataSource={dashboard} rowKey="id" />
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const res = await axios.get<DashboardResponse>(ApiEndpoint.booking)

  const dashboardRes = res.data

  return {
    props: {
      dashboard: dashboardRes.Items,
    },
  }
}
