'use client';

import { Tenali_Ramakrishna } from 'next/font/google';
import React, {useState, useEffect} from 'react';
import { convertToFeet } from './format_data';

interface Tank{
    primo_id: string;
    tank_type: string;
    tank_number: number;
    Level: number;
    Volume: number;
    InchesToESD: number | null;
    TimeUntilESD: number | null;
    Capacity: number;
    percent_full: number;
}
//using interface to define the structure of my JSON data 

interface TankData{
    tanks: Tank[];
}

interface RequestPayload {
    primo_ids: string[];
    tank_types: string[];
}

const DataFetchingComponent = () => {
    const [data, setData] = useState<TankData | null>(null); //type safety: <TankData | null>: either a valid TankData object or null

    useEffect(() => {
        const fetchData = async () => {
            try {
                const req: RequestPayload = { primo_ids: ["69419"], tank_types: ["Oil"]}; // my request payload
                const response = await fetch('https://tank-project-2-glgjkoxnua-uc.a.run.app/tanks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(req)
                });

                if(!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }

                const result: TankData = await response.json();
                setData(result);
                
            } catch(error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();
    }, []);

    return (
        <div>
            {data ? (
                <div>
                    {data.tanks.map((tank, index) => {
    
                        return (
                            <div key={index}>
                                <p>Primo ID: {tank.primo_id}</p>
                                <p>{tank.tank_type} Tank #{tank.tank_number}</p>
                                <p>Tank Capacity: {tank.Capacity}</p>
                                <p>{convertToFeet(tank.Level)} tank level</p>
                                <p>Volume: {tank.Volume}</p>
                                <p>{convertToFeet(tank.InchesToESD)} to ESD</p>
                                <hr />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default DataFetchingComponent;