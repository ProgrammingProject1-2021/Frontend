import axios, {AxiosResponse} from 'axios'
import {Table, Tag, Space} from 'antd'
import React, { useState } from 'react'

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
        },
        {
            title: 'Registration',
            dataIndex: 'Registration',
        },
        {
            title: 'Current Customer',
            dataIndex: 'Current_customer',
        },
        {
            title: 'Location Name',
            dataIndex: 'Location_name',
        },
    ]


    return (
        <>
            <div className="main">
                <div className="col-md-8 col-sm-12">
                    <div className="view-available-cars">
                        <h2>View Available Cars</h2>

                        <Table columns={columns} dataSource={cars} rowKey="id" />
                    </div>
                </div>
            </div>
        </>
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