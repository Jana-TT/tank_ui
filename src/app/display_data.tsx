'use client';

import { fetchFacilityData, fetchTankData } from '../../components/data_fetch';
import { TankData, FacilityData } from '../../components/interfaces';
import TextField from '@mui/material/TextField';
import React, { useState, useEffect } from 'react';
import TankCard from '../../components/tank_card';
import { SearchSuggest } from '../../components/search_suggest';

export const DataTransform = () => {
    const [facData, setFacData] = useState<FacilityData | null>(null);
    const [tankData, setTankData] = useState<TankData | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetch_fac_data = async () => {
            const fac_result = await fetchFacilityData();
            if (fac_result.error) {setError(fac_result.error);} 
            else {setFacData(fac_result.data);}
        };

        fetch_fac_data();
    }, []);

    useEffect(() => {
        const fetch_tank_data = async() => {
            const tank_result = await fetchTankData(['69419', '98750', '98743']);
            if (tank_result.error) {setError(tank_result.error);}
            else {setTankData(tank_result.data);}
        };

        fetch_tank_data();
    }, []);

    const extract_fac_names = facData?.facilities.map(facility_names => facility_names.entity_name) || [];
    const extract_division_names = facData?.facilities.map(division_name => division_name.division_name) || [];
    const search_list = extract_fac_names.concat(extract_division_names);

    return (
        <div>
            {search_list.length > 0 ? (
                <ul>
                    {search_list.map((name, index) => (
                        <li key={index}>{name}</li>
                    ))}
                </ul>
            ) : (
                <p>No facility names available</p>
            )}
        </div>
    );
};

export default DataTransform;

//facData && <div>Facility Data: {JSON.stringify(facData)}</div>