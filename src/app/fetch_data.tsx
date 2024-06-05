'use client';

import React, {useState, useEffect} from 'react';
import { convertToFeet } from './inches_to_feet';
import { percent_full_tank } from './percent_full_display';

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
                const req: RequestPayload = { primo_ids: ["69419", "480001"], tank_types: ["Oil", "Water"]}; // my request payload
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

    const displayed_primo_id = new Set<string>(); //set used for unique values, arrays are use for duplicate values 

    return (
        <div>
            {data ? (
                <div>
                    {data.tanks.map((tank) => {
                        const unique_primo_id: boolean = !displayed_primo_id.has(tank.primo_id) //if doesnt have the current primo_id
                        if (unique_primo_id) {
                            displayed_primo_id.add(tank.primo_id); //add it
                        }
                        return (
                            <div>
                                <h4>{unique_primo_id && <p>{tank.primo_id}</p>}</h4>
                                <p>{tank.percent_full}% {percent_full_tank(tank.percent_full, tank.tank_type)}</p>
                                <p>{tank.tank_type} Tank #{tank.tank_number}</p>
                                <p>Tank Capacity: {tank.Capacity}</p>
                                <p>{convertToFeet(tank.Level)} tank level</p>
                                <p>Volume: {tank.Volume} bbl</p>
                                {tank.InchesToESD !== null && (<p>{convertToFeet(tank.InchesToESD)} to ESD</p>)}
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