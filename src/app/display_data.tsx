'use client';

import React, { useState, useEffect } from 'react';
import { fetchFacilityData, fetchTankData } from '../../components/data_fetch';
import { TankData, FacilityData } from '../../components/interfaces';
import TankCard from '../../components/tank_card'; 
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const DataTransform = () => {
    const [facData, setFacData] = useState<FacilityData | null>(null);
    const [tankData, setTankData] = useState<TankData | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const [selectedDivision, setSelectedDivision] = useState<string>('');
    const [selectedForeman, setSelectedForeman] = useState<string>('');
    const [selectedRoute, setSelectedRoute] = useState<string>('');
    const [selectedFacility, setSelectedFacility] = useState<string>('');

    const [propertyId, setpropertyId] = useState<string | null>(null);

    useEffect(() => {
        const fetch_fac_data = async () => {
            const fac_result = await fetchFacilityData();
            if (fac_result.error) {
                setError(fac_result.error);
            } else {
                setFacData(fac_result.data);
                const facility = fac_result.data.facilities.find((fac: any) =>
                    fac.division_name === selectedDivision &&
                    fac.foreman_name === selectedForeman &&
                    fac.route_name === selectedRoute &&
                    fac.facility_name === selectedFacility
                );
                if (facility) {
                    setpropertyId(facility.property_id); 
                }
            }
        };

        fetch_fac_data();
    }, [selectedDivision, selectedForeman, selectedRoute, selectedFacility]);

    useEffect(() => {
        if (propertyId) {
            const fetch_tank_data = async () => {
                const tank_result = await fetchTankData([propertyId]);
                if (tank_result.error) {
                    setError(tank_result.error);
                } else {
                    setTankData(tank_result.data);
                }
            };

            fetch_tank_data();
        }
    }, [propertyId]);

    const extractNames = (key: string, filters: Record<string, string> = {}) => {
        if (!facData) return [];
        const uniqueNames = new Set<string>();
        facData.facilities.forEach((facility: any) => {
            if (Object.entries(filters).every(([k, v]) => !v || facility[k] === v)) {
                uniqueNames.add(facility[key]);
            }
        });
        return Array.from(uniqueNames);
    };

    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: SelectChangeEvent<string>) => {
        setter(event.target.value as string);
    };

    const handleBackButton = (setter: React.Dispatch<React.SetStateAction<string>>) => () => {
        setter('');
    };

    const divisionOptions = extractNames('division_name');
    const foremanOptions = extractNames('foreman_name', { division_name: selectedDivision });
    const routeOptions = extractNames('route_name', { division_name: selectedDivision, foreman_name: selectedForeman });
    const facilityOptions = extractNames('facility_name', { division_name: selectedDivision, foreman_name: selectedForeman, route_name: selectedRoute });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', backgroundColor:'#282b30', width:'100%', paddingTop:'6px', paddingLeft:'10px', paddingBottom:'2px', boxShadow:'0px 10px 8px rgba(0, 0, 0, 0.1)' }}>
                
                {/* Division Selection */}
                {selectedForeman || selectedRoute ? null : (
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', border: '10px', borderRadius: '25px', minWidth: '150px' }}>
                        {selectedDivision ? (
                            <>
                                <ArrowBackIcon onClick={handleBackButton(setSelectedDivision)} sx={{ cursor: 'pointer', marginRight: '8px' }} />
                                <Typography sx={{ fontSize: '12px' }}>{selectedDivision}</Typography>
                            </>
                        ) : (
                            <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px' }}>
                                <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7' }}>Division name</InputLabel>
                                <Select
                                    value={selectedDivision}
                                    onChange={handleChange(setSelectedDivision)}
                                    sx={{ height: '30px', fontSize: '12px', padding: '8px' }}
                                >
                                    {divisionOptions.map((name, index) => (
                                        <MenuItem key={index} value={name} sx={{ fontSize: '12px' }}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                )}

                {/* Foreman Selection */}
                {selectedRoute ? null : (
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', border: '10px', borderRadius: '25px', minWidth: '150px' }}>
                        {selectedForeman ? (
                            <>
                                <ArrowBackIcon onClick={handleBackButton(setSelectedForeman)} sx={{ cursor: 'pointer', marginRight: '8px' }} />
                                <Typography sx={{ fontSize: '12px' }}>{selectedForeman}</Typography>
                            </>
                        ) : (
                            <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px' }}>
                                <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7' }}>Foreman name</InputLabel>
                                <Select
                                    value={selectedForeman}
                                    onChange={handleChange(setSelectedForeman)}
                                    sx={{ height: '30px', fontSize: '12px', padding: '8px' }}
                                >
                                    {foremanOptions.map((name, index) => (
                                        <MenuItem key={index} value={name} sx={{ fontSize: '12px' }}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                )}

                {/* Route Selection */}
                {selectedDivision && selectedForeman && (
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', border: '10px', borderRadius: '25px', minWidth: '150px' }}>
                        {selectedRoute ? (
                            <>
                                <ArrowBackIcon onClick={handleBackButton(setSelectedRoute)} sx={{ cursor: 'pointer', marginRight: '8px' }} />
                                <Typography variant="body1" sx={{ fontSize: '12px' }}>{selectedRoute}</Typography>
                            </>
                        ) : (
                            <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px' }}>
                                <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7' }}>Route name</InputLabel>
                                <Select
                                    value={selectedRoute}
                                    onChange={handleChange(setSelectedRoute)}
                                    sx={{ height: '30px', fontSize: '12px', padding: '8px' }}
                                >
                                    {routeOptions.map((name, index) => (
                                        <MenuItem key={index} value={name} sx={{ fontSize: '12px' }}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                )}

                {/* Facility Selection */}
                {selectedRoute && (
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', border: '10px', borderRadius: '25px', minWidth: '150px' }}>
                        <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px' }}>
                            <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7' }}>Facility name</InputLabel>
                            <Select
                                value={selectedFacility}
                                onChange={handleChange(setSelectedFacility)}
                                sx={{ height: '30px', fontSize: '12px', padding: '8px' }}
                            >
                                {facilityOptions.map((name, index) => (
                                    <MenuItem key={index} value={name} sx={{ fontSize: '12px' }}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </Box>

            <Box sx={{ marginTop: '20px', marginLeft:'65px' }}>
                {tankData && tankData.tanks.length > 0 ? (
                    <Grid container spacing={4}>
                        {tankData.tanks.map((tank) => (
                            <Grid item key={`${tank.property_id}-${tank.tank_type}-${tank.tank_number}`}>
                                <TankCard tank={tank} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="h6" sx={{ color: 'white' }}>Loading...</Typography>
                )}
            </Box>
        </Box>
    );
};

export default DataTransform;
