'use client';

import { TankData, FacilityData, Tank } from '../../components/interfaces';
import { fetchFacilityData, fetchTankData } from '../../components/data_fetch';
import TankCard from '../../components/tank_card';
import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import Fuse from 'fuse.js';
import { Box, Grid, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

export const DataTransform = () => {
    const [data, setData] = useState<TankData | null>(null);
    const [facData, setFacData] = useState<FacilityData | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [primoid, setPrimoid] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [facName] = useState<string[]>([]);

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

    //-----------------------------------------------------------------------------------------//

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

    //-----------------------------------------------------------------------------------------//

    const inputProps = {
        placeholder: 'Search...',
        value: searchTerm,
        onChange: (_event: React.ChangeEvent<any>, { newValue }: { newValue: string }) => {
            setSearchTerm(newValue);
            if (newValue.trim() === "") {
                setPrimoid([]);
            }
        }
    };

    const renderInputComponent = (inputProps: any) => (
        <TextField
            {...inputProps}
            InputProps={{
                ...inputProps.InputProps,
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{color: '#77c3ec'}} />
                    </InputAdornment>
                ),
                style: { width: 'fit-content', padding: '1px', borderRadius: '5px', background:'#191919', height: '20px', color: 'white', border: '1px solid #9ba3a2'}
            }}
        />
    );

    //-----------------------------------------------------------------------------------------//

    const groupTanksByFacility = () => {
        if (!data || !facData) return {};

        const facilityMap: { [key: string]: Tank[] } = {};
        data.tanks.forEach(tank => {
            const facility = facData.facilities.find(fac => fac.primo_id === tank.primo_id);
            if (facility) {
                if (!facilityMap[facility.entity_name]) {
                    facilityMap[facility.entity_name] = [];
                }
                facilityMap[facility.entity_name].push(tank);
            }
        });

        return facilityMap;
    };

    const facilityTanksMap = groupTanksByFacility();

    //-----------------------------------------------------------------------------------------//

    return (
        <Box sx={{ marginTop: 1 }}>
            <Box sx={{ marginLeft: 3 }}>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={() => { }}
                    onSuggestionsClearRequested={() => { }}
                    onSuggestionSelected={onSuggestionSelected}
                    getSuggestionValue={(suggestion: string) => suggestion}
                    renderSuggestion={(suggestion: string) => <div>{suggestion}</div>}
                    inputProps={inputProps}
                    renderInputComponent={renderInputComponent}
                />
            </Box>

            <Grid container spacing={2} sx={{ marginTop: 2, marginLeft: 2 }}>
                {Object.keys(facilityTanksMap).length > 0 ? (
                    Object.entries(facilityTanksMap).map(([facilityName, tanks]) => (
                        <Grid item xs={12} key={facilityName}>
                            <Typography sx={{ fontSize: '0.96rem' }}>{facilityName}</Typography>
                            <Grid container spacing={2}>
                                {tanks.map(tank => (
                                    <Grid item key={`${tank.primo_id}-${tank.tank_type}-${tank.tank_number}`}>
                                        <TankCard tank={tank} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <div>Enter a Facility Name or a Division Name</div>
                    </Grid>
                )}
            </Grid>

        
        </Box>
    );
}

export default DataTransform;
