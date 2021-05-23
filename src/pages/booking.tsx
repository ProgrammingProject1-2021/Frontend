import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, notification, Space, Table } from 'antd'
import axios, { AxiosResponse } from 'axios'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import MapView from '../components/map'
import Navigation from '../components/navigation'
import { ApiEndpoint } from '../constant/api'
import { Location, LocationsResponse, Vehicle, VehicleResponse } from '../types'
import { useHistory } from "react-router-dom"



type BookingPageProps = {
  vehicles: Vehicle[]
  locations: Location[]
}

export default function BookingPage({ locations, vehicles }: BookingPageProps) {
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
      title: 'Location Name',
      dataIndex: 'Location_name',
      ...getColumnSearchProps('Location_name'),
    },
    {
      title: 'Action',
      render: (row: Vehicle) => (
        <Button type="primary" onClick={() => handleBooking(row)} style={{ width: 90 }}>
          Book
        </Button>
      ),
    },
  ]

  const router = useRouter()
  const [searchState, setSearchState] = useState({
    searchText: '',
    searchedColumn: '',
  })
  const searchInputEl = useRef(null)

  async function handleBooking(vehicle: Vehicle) {
    // click book button to bookinghourpage
    this.props.history.push("/bookinghourpage ")
    console.log('Booking vehicle', vehicle)
    // TODO: change carId to selected car
    const carId = ''
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

  // When the user clicks a maker on the map, navigate to the same page with query parameter
  // of location name.
  function handleMarker(loc: string) {
    router.push('/booking?location_name=' + loc)
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
      <Navigation />

      <MapView locations={locations} handleMarker={handleMarker} />
      <Table columns={columns} dataSource={vehicles} rowKey={(row) => row.id} />
    </div>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let props: BookingPageProps = { vehicles: [], locations: [] }

  try {
    const locationRes = await axios.get<LocationsResponse>(ApiEndpoint.parkingLocations)
    let vehicleRes: AxiosResponse<VehicleResponse>
    // Get query parameter from url (?location_name=)
    const locationName = ctx.query?.location_name
    if (locationName) {
      vehicleRes = await axios.get<VehicleResponse>(`${ApiEndpoint.vehicle}?Location_name=${locationName}`)
    } else {
      vehicleRes = await axios.get<VehicleResponse>(ApiEndpoint.vehicle)
    }

    props = {
      vehicles: vehicleRes.data.Items,
      locations: locationRes.data.Items,
    }
  } catch ({ response, message }) {
    if (response) {
      console.error('Error getting vehicles and locations', response?.data?.message)
    } else {
      console.error(message)
    }
  }

  return {
    props,
  }
}
