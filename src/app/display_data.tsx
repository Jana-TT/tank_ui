'use client';

import { fetchFacilityData, fetchTankData } from '../../components/data_fetch';
import { TankData, FacilityData } from '../../components/interfaces';
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const DataTransform = () => {
    const [facData, setFacData] = useState<FacilityData | null>(null);
    const [tankData, setTankData] = useState<TankData | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [selectedDivision, setSelectedDivision] = useState<string>('');
    const [selectedForeman, setSelectedForeman] = useState<string>('');
    const [selectedRoute, setSelectedRoute] = useState<string>('');

    useEffect(() => {
        const fetch_fac_data = async () => {
            const fac_result = await fetchFacilityData();
            if (fac_result.error) { setError(fac_result.error); } 
            else { setFacData(fac_result.data); }
        };

        fetch_fac_data();
    }, []);

    useEffect(() => {
        const fetch_tank_data = async () => {
            const tank_result = await fetchTankData(['69419', '98750', '98743']);
            if (tank_result.error) { setError(tank_result.error); }
            else { setTankData(tank_result.data); }
        };

        fetch_tank_data();
    }, []);

    const extract_fac_names: string[] = facData?.facilities.map(facility_names => facility_names.entity_name) || [];
    const extract_division_names: string[] = facData?.facilities.map(division_name => division_name.division_name) || [];
    const extract_foreman_names: string[] = facData?.facilities.map(foreman_names => foreman_names.foreman_name) || [];
    const search_list: string[] = extract_fac_names.concat(extract_division_names);
    const search_list_2: string[] = ["pp", "poopie", "testing", "this"];
    const search_list_3: string[] = ["pp", "poopie", "testing", "this"];

    const handleDivisionChange = (event: SelectChangeEvent<string>) => {
        setSelectedDivision(event.target.value as string);
    };

    const handleForemanChange = (event: SelectChangeEvent<string>) => {
        setSelectedForeman(event.target.value as string);
    };

    const handleRouteChange = (event: SelectChangeEvent<string>) => {
        setSelectedRoute(event.target.value as string);
    }

    const handleBackButton1 = () => {
        setSelectedDivision('');
    };

    const handleButtonClick2 = () => {
        setSelectedForeman('');
    }  

    return (
        <Box sx={{display: 'inline-flex', marginTop:'10px'}}>
            <Container>
                {selectedDivision ? (
                    <Box sx={{display: 'flex', alignItems: 'center', backgroundColor: 'gray', padding: '8px', borderRadius: '4px' }}>
                        <ArrowBackIcon onClick={handleBackButton1} sx={{ cursor: 'pointer', marginRight: '8px' }} />
                        <Typography variant="body1" sx={{ fontSize: '12px' }}>{selectedDivision}</Typography>
                    </Box>
                ) : (
                    <FormControl sx={{ backgroundColor: 'gray', width: '150px', height: '30px' }}>
                        <InputLabel sx={{ fontSize: '12px' }}>Select division</InputLabel>
                        <Select
                            value={selectedDivision}
                            onChange={handleDivisionChange}
                            sx={{height: '30px', fontSize: '12px', padding: '8px',
                            }}
                        >
                            {extract_division_names.map((element, index) => (
                                <MenuItem key={index} value={element} sx={{ fontSize: '12px' }}>{element}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Container>

            <Container>
                {selectedForeman ? (
                    <Box sx={{display: 'flex', alignItems: 'center', backgroundColor: 'gray', padding: '8px', borderRadius: '4px' }}> 
                        <ArrowBackIcon onClick={handleButtonClick2} sx={{cursor: 'pointer', margineRight:'8px'}}/>
                        <Typography variant="body1" sx={{ fontSize: '12px' }}>{selectedForeman}</Typography>
                    </Box>
                   
                ) : (                    
                <FormControl sx={{ backgroundColor: 'gray', width: '150px', height: '30px' }}>
                    <InputLabel sx={{ fontSize: '12px' }}>Select foreman</InputLabel>
                    <Select
                        value={selectedForeman}
                        onChange={handleForemanChange}
                        sx={{height: '30px', fontSize: '12px', padding: '8px',
                        }}
                    >
                        {extract_foreman_names.map((element, index) => (
                            <MenuItem key={index} value={element} sx={{ fontSize: '12px' }}>{element}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                
            )

                }
            </Container>

            <Container>
                {selectedDivision ? (
                    <FormControl sx={{ backgroundColor: 'gray', width: '150px', height: '30px' }}>
                    <InputLabel sx={{ fontSize: '12px' }}>Select Rout klihgyuviue</InputLabel>
                    <Select
                        value={selectedRoute}
                        onChange={handleRouteChange}
                        sx={{height: '30px', fontSize: '12px', padding: '8px'}}
                    >
                        {extract_fac_names.map((element, index) => (
                            <MenuItem key={index} value={element} sx={{ fontSize: '12px' }}>{element}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                    ) : (
                    <div>pp</div>
                )}
            </Container>
        </Box>
    );
};

export default DataTransform;