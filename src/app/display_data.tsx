'use client';

import { TankData, FacilityData} from '../../components/interfaces';
import { fetchFacilityData, fetchTankData } from '../../components/data_fetch';
import TankCard from '../../components/tank_card';
import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import Fuse from 'fuse.js';
import { Box, Grid } from '@mui/material';

export const DataTransform = () => {
    const [data, setData] = useState<TankData | null>(null);
    const [facData, setFacData] = useState<FacilityData | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [primoid, setPrimoid] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
    fetchFacilityData()
    .then((result) => setFacData(result))
    .catch((error) => console.error('Error fetching facility data:', error));
    }, []);

    useEffect(() => {
    if (primoid.length > 0) {
    fetchTankData(primoid)
    .then((result) => setData(result))
    .catch((error) => console.error('Error fetching tank data:', error));
    } else {
    setData(null);
    }
    }, [primoid]);

    useEffect(() => {
    if (searchTerm.trim() && facData) {
    const fuzzy_search = new Fuse(facData.facilities, {
    keys: ['entity_name', 'division_name'],
    threshold: 0.3
    });

        const result = fuzzy_search.search(searchTerm);
        const extract_facility_names = result.map(res => res.item.entity_name);
        const unique_division_names = new Set<string>();

        result.forEach(res => {
            unique_division_names.add(res.item.division_name);
        });

        const extract_primo_id = result.map(res => res.item.primo_id);
        setPrimoid(extract_primo_id);

        setSuggestions([...extract_facility_names, ...Array.from(unique_division_names)]);
    } else {
        setSuggestions([]);
    }
    }, [searchTerm, facData]);

    const onSuggestionSelected = (_event: React.FormEvent<any>, { suggestion }: { suggestion: string }) => {
    setSearchTerm(suggestion);
    };

    const inputProps = {
    placeholder: 'Search by facility or city name',
    value: searchTerm,
    onChange: (_event: React.FormEvent<any>, { newValue }: { newValue: string }) => { setSearchTerm(newValue); }
    };

    return (
    <Box sx={{ }}>
    <Autosuggest
    suggestions={suggestions}
    onSuggestionsFetchRequested={() => {}}
    onSuggestionsClearRequested={() => {}}
    onSuggestionSelected={onSuggestionSelected}
    getSuggestionValue={(suggestion: string) => suggestion}
    renderSuggestion={(suggestion: string) => <div>{suggestion}</div>}
    inputProps={inputProps}
    />

        <Grid container spacing={2} sx={{ marginTop: 2, marginLeft: 2 }}>
            {data && data.tanks.length > 0 ? (
                data.tanks.map((tank) => (
                    <Grid item key={`${tank.primo_id}-${tank.tank_type}-${tank.tank_number}`}>
                        <TankCard tank={tank}/>
                    </Grid>
                ))
            ) : (
                <Grid item xs={12}>
                    <div>Loading...</div>
                </Grid>
            )}
        </Grid>
    </Box>
);

}

export default DataTransform;