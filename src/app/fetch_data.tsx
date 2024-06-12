'use client';

import React, {useState, useEffect} from 'react';
import { convertToFeet } from './inches_to_feet';
import { percent_full_tank } from './percent_full_display';
import Fuse from 'fuse.js';

interface Tank {
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

interface TankData {
    tanks: Tank[];
}

interface Facility {
    primo_id: string;
    division_name: string;
    division_id: string;
    entity_type: string;
    entity_name: string;
}

interface FacilityData {
    facilities: Facility[];
}

interface RequestPayload {
    primo_ids: string[];
    tank_types: string[];
}

const DataFetchingComponent = () => {
    const [data, setData] = useState<TankData | null>(null);
    const [facData, setFacData] = useState<FacilityData | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredTanks, setFilteredTanks] = useState<Tank[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const req: RequestPayload = { primo_ids: ["69419", "480001"], tank_types: ["Oil", "Water"]}; 
                const response = await fetch('https://tank-project-2-glgjkoxnua-uc.a.run.app/tanks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(req)
                });

                const fac_res = await fetch('https://tank-project-2-glgjkoxnua-uc.a.run.app/facilities', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'}
                });

                if(!response.ok || !fac_res.ok) {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }

                const result: TankData = await response.json();
                const fac_result: FacilityData = await fac_res.json();
                setData(result);
                setFacData(fac_result);
                
            } catch(error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();
    }, []);

    useEffect(() => {
        if(searchTerm && facData){
            const fuzzy_search = new Fuse(facData.facilities, {
                keys: ['entity_name', 'division_name'],
                threshold: 0.5
            });

            const result = fuzzy_search.search(searchTerm);
            const extract_primo_id = result.map(res => res.item.primo_id);

            if(data){
                const filtered = data.tanks.filter(tank => extract_primo_id.includes(tank.primo_id));
                setFilteredTanks(filtered);
            } else {
                setFilteredTanks([]);
            }
        } else {
            setFilteredTanks([]);
        }
    }, [searchTerm, data, facData]);

    const displayed_primo_id = new Set<string>();

    return (
        <div>
            {data ? (
                <div>
                    <input 
                        type='text' 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="Search by facility or city name"
                    />
                    {filteredTanks.map((tank) => {
                        const unique_primo_id: boolean = !displayed_primo_id.has(tank.primo_id);
                        if (unique_primo_id) {
                            displayed_primo_id.add(tank.primo_id);
                        }
                        return (
                            <div key={tank.primo_id}>
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
