import axios, {AxiosResponse} from 'axios'
import router from 'next/router'
import { useState } from 'react'

const API_ENDPOINT =
    'https://ekfj8gcvhh.execute-api.ap-southeast-2.amazonaws.com/test/VehicleAPI'

interface Cars {
    registration: string;
    model: string;
    location_name: number;
    current_customer: string;
}

export default function ViewAvailableCars() {
    const [errorMsg, setErrorMsg] = useState('')

    async function onSubmit(data: Cars) {
        const { model, registration, location_name, current_customer  } = data
        const [cars, setCarList] = useState<Cars[]>([]);

        try {
            await axios.get<Cars[]>(API_ENDPOINT)
                .then((response: AxiosResponse) => {
                    console.log(response.data);
                    setCarList(response.data);

            });
        } catch (e) {
            console.error('Error displaying:', e)
            setErrorMsg(e.message)
        }
    }
    return (
        <>
            <div className="main">
                <div className="col-md-8 col-sm-12">
                    <h2>View Available Cars</h2>
                    <div className="view-available-cars">
                        {errorMsg && (
                            <div className="alert alert-danger" role="alert">
                                {errorMsg}
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </>
    )
}
