import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, Space, Table } from 'antd'
import axios from 'axios'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import MapView from '../components/map'
import Navigation from '../components/navigation'
import { ApiEndpoint } from '../constant/api'
import { Location, LocationsResponse, Vehicle, VehicleResponse } from '../types'

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
    console.log('Booking vehicle', vehicle)

    router.push('/bookinghourpage?registration=' + vehicle.Registration)
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
    let vehicles: Vehicle[]
    // Get query parameter from url (?location_name=)
    const locationName = ctx.query?.location_name
    if (locationName) {
      const vehicleRes = await axios.get<VehicleResponse>(`${ApiEndpoint.vehicle}?Location_name=${locationName}`)
      vehicles = vehicleRes.data.Items
    } else {
      const response = await axios.get<VehicleResponse>(ApiEndpoint.vehicle)
      vehicles = response.data.Items.filter((vehicle) => vehicle.Current_customer === '')
    }

    props = {
      vehicles,
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
