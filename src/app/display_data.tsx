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
    const [selectedWell, setSelectedWell] = useState<string>('');

    const [primoId, setPrimoId] = useState<string | null>(null);

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
                    fac.entity_name === selectedFacility
                );
                if (facility) {
                    setPrimoId(facility.primo_id); 
                }
            }
        };

        fetch_fac_data();
    }, [selectedDivision, selectedForeman, selectedRoute, selectedFacility]);

    useEffect(() => {
        if (primoId) {
            const fetch_tank_data = async () => {
                const tank_result = await fetchTankData([primoId]);
                if (tank_result.error) {
                    setError(tank_result.error);
                } else {
                    setTankData(tank_result.data);
                }
            };

            fetch_tank_data();
        }
    }, [primoId]);

    const extractNames = (key: string) => facData?.facilities.map((facility: any) => facility[key]) || [];

    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: SelectChangeEvent<string>) => {
        setter(event.target.value as string);
    };

    const handleBackButton = (setter: React.Dispatch<React.SetStateAction<string>>) => () => {
        setter('');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', backgroundColor:'#282b30', width:'100%', paddingTop:'6px', paddingLeft:'10px', paddingBottom:'2px', boxShadow:'0px 10px 8px rgba(0, 0, 0, 0.1)'}}>
                
                {/* Division Selection */}
                {selectedForeman || selectedRoute ? null : (
                    <Box sx={{display: 'flex', alignItems: 'center', padding: '8px', border:'10px', borderRadius: '25px', minWidth: '150px'}}>
                        {selectedDivision ? (
                            <>
                                <ArrowBackIcon onClick={handleBackButton(setSelectedDivision)} sx={{cursor: 'pointer', marginRight: '8px'}} />
                                <Typography sx={{fontSize: '12px'}}>{selectedDivision}</Typography>
                            </>
                        ) : (
                            <FormControl sx={{backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px'}}>
                                <InputLabel sx={{fontSize: '12px', color:'#a4a7a7'}}>Division name</InputLabel>
                                <Select
                                    value={selectedDivision}
                                    onChange={handleChange(setSelectedDivision)}
                                    sx={{height: '30px', fontSize: '12px', padding: '8px'}}
                                >
                                    {extractNames('division_name').map((name, index) => (
                                        <MenuItem key={index} value={name} sx={{fontSize: '12px'}}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                )}

                {/* Foreman Selection */}
                {selectedRoute ? null : (
                    <Box sx={{display: 'flex', alignItems: 'center', padding: '8px', border:'10px', borderRadius: '25px', minWidth: '150px'}}>
                        {selectedForeman ? (
                            <>
                                <ArrowBackIcon onClick={handleBackButton(setSelectedForeman)} sx={{ cursor: 'pointer', marginRight: '8px'}} />
                                <Typography sx={{fontSize: '12px'}}>{selectedForeman}</Typography>
                            </>
                        ) : (
                            <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px'}}>
                                <InputLabel sx={{fontSize: '12px', color:'#a4a7a7'}}>Foreman name</InputLabel>
                                <Select
                                    value={selectedForeman}
                                    onChange={handleChange(setSelectedForeman)}
                                    sx={{ height: '30px', fontSize: '12px', padding: '8px' }}
                                >
                                    {extractNames('foreman_name').map((name, index) => (
                                        <MenuItem key={index} value={name} sx={{ fontSize: '12px' }}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                )}

                {/* Route Selection */}
                {selectedDivision && selectedForeman && (
                    <Box sx={{display: 'flex', alignItems: 'center', padding: '8px', border:'10px', borderRadius: '25px', minWidth: '150px'}}>
                        {selectedRoute ? (
                            <>
                                <ArrowBackIcon onClick={handleBackButton(setSelectedRoute)} sx={{ cursor: 'pointer', marginRight: '8px' }} />
                                <Typography variant="body1" sx={{ fontSize: '12px' }}>{selectedRoute}</Typography>
                            </>
                        ) : (
                            <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px'}}>
                                <InputLabel sx={{fontSize: '12px', color:'#a4a7a7'}}>Route name</InputLabel>
                                <Select
                                    value={selectedRoute}
                                    onChange={handleChange(setSelectedRoute)}
                                    sx={{ height: '30px', fontSize: '12px', padding: '8px' }}
                                >
                                    {extractNames('route_name').map((name, index) => (
                                        <MenuItem key={index} value={name} sx={{ fontSize: '12px' }}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                )}

                {/* Facility Selection */}
                {selectedRoute && (
                    <Box sx={{display: 'flex', alignItems: 'center', padding: '8px', border:'10px', borderRadius: '25px', minWidth: '150px'}}>
                        <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px'}}>
                            <InputLabel sx={{fontSize: '12px', color:'#a4a7a7'}}>Facility name</InputLabel>
                            <Select
                                value={selectedFacility}
                                onChange={handleChange(setSelectedFacility)}
                                sx={{height: '30px', fontSize: '12px', padding: '8px'}}
                            >
                                {extractNames('entity_name').map((name, index) => (
                                    <MenuItem key={index} value={name} sx={{ fontSize: '12px' }}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}

                {/* Well Selection */}
                {selectedRoute && (
                    <Box sx={{display: 'flex', alignItems: 'center', padding: '8px', border:'10px', borderRadius: '25px', minWidth: '150px'}}>
                        <FormControl sx={{backgroundColor:'#424549', width: '100%', height: '30px'}}>
                            <InputLabel sx={{fontSize: '12px', color:'#a4a7a7'}}>Well name</InputLabel>
                            <Select
                                value={selectedWell}
                                onChange={handleChange(setSelectedWell)}
                                sx={{height: '30px', fontSize: '12px', padding: '8px'}}
                            >
                                {extractNames('well_name').map((name, index) => (
                                    <MenuItem key={index} value={name} sx={{fontSize: '12px'}}>{name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </Box>

            <Box sx={{ marginTop: '20px', marginLeft:'65px'}}>
                {tankData && tankData.tanks.length > 0 ? (
                    <Grid container spacing={4}>
                        {tankData.tanks.map((tank) => (
                            <Grid item key={`${tank.primo_id}-${tank.tank_type}-${tank.tank_number}`}>
                                <TankCard tank={tank} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="h6" sx={{ color: 'white' }}>No tanks available for the selected filters</Typography>
                )}
            </Box>

        </Box>
    );
};

export default DataTransform;
