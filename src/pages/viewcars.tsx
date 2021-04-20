import axios, {AxiosResponse} from 'axios'
import {Table, Tag, Space} from 'antd'
import React, { useState } from 'react'

const {Column, ColumnGroup} = Table;

const API_ENDPOINT =
    'https://ekfj8gcvhh.execute-api.ap-southeast-2.amazonaws.com/test/VehicleAPI'

type Cars = {
    registration: string;
    model: string;
    location_name: string;
    current_customer: string;
}

type CarsProps = {
    cars: Cars[]
}

export default function ViewAvailableCars({cars}: CarsProps) {
    const columns = [
        {
            title: 'Model',
            dataIndex: 'Model',
            key: 'Model',
        },
        {
            title: 'Registration',
            dataIndex: 'Registration',
            key: 'Registration',
        },
        {
            title: 'Current Customer',
            dataIndex: 'Current_customer',
            key: 'Current_customer',
        },
        {
            title: 'Location Name',
            dataIndex: 'Location_name',
            key: 'Location_name',
        },
    ]


    return (
        <div className="container pt-4 pb-3">
            <div className='row'>
                <div className="col-md-4">
                    <div className="view-available-cars">
                        <h2>View Available Cars</h2>
                    </div>
                </div>
                <div className="col-md-8">
                    <Table dataSource={cars}>
                        <ColumnGroup title="Available cars">
                            <Column title="Model" dataIndex="Model"/>
                            <Column title="Registration" dataIndex="Registration"/>
                            <Column title="Current_customer" dataIndex="Current_customer"/>
                            <Column title="Location_name" dataIndex="Location_name"/>
                        </ColumnGroup>
                    </Table>,
                </div>
            </div>
        </div>

    )
}

type carsArray = {
    Items: Cars[]
    Count: number
}

export async function getServerSideProps(context) {
    const data = await axios.get<carsArray>(API_ENDPOINT)

    const carsData = data.data

    return {
        props: {
            cars: carsData.Items,
        },
    }
}