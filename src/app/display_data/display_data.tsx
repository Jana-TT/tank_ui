'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { fetchFacilityData, fetchTanksData } from '../../../components/data_fetch';
import { TankData, FacilityData } from '../../../components/interfaces';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useSearchParams } from 'next/navigation';
import SuspenseBoundary from '../../../components/suspense_boundary';

const TankCard = lazy(() => import('../../../components/tank_card'));

export const DataTransform = () => {
    const [facData, setFacData] = useState<FacilityData | null>(null);
    const [tankData, setTankData] = useState<TankData | null>(null);
    const [error, setError] = useState<Error | null>(null);
    
    const [selectedDivision, setSelectedDivision] = useState<string>('');
    const [selectedForeman, setSelectedForeman] = useState<string>('');
    const [selectedRoute, setSelectedRoute] = useState<string>('');
    const [selectedFacility, setSelectedFacility] = useState<string>('');

    const [propertyId, setPropertyId] = useState<string[]>([]);    
    const [selectedScadID, setSelectedScadaID] = useState<string | null>(null);
    const [second_sk, setSecondSK] = useState<string>('');
  

    const router = useRouter(); // Initialize the router
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchFacData = async () => {
            const facResult = await fetchFacilityData();
            if (facResult.error) {
                setError(facResult.error);
            } else {
                setFacData(facResult.data);
                const matchingFacilities = facResult.data.facilities.filter((fac: any) =>
                    (!selectedDivision || fac.division_name === selectedDivision) &&
                    (!selectedForeman || fac.foreman_name === selectedForeman) &&
                    (!selectedRoute || fac.route_name === selectedRoute) &&
                    (!selectedFacility || fac.facility_name === selectedFacility)
                );
    
                const propertyIds = matchingFacilities.map((facility: any) => facility.property_id);
                setPropertyId(propertyIds);
            }
        };

        fetchFacData();
    }, [selectedDivision, selectedForeman, selectedRoute, selectedFacility]);

    useEffect(() => {
        if (propertyId.length > 0) {
            const fetchTankData = async () => {
                const tankResult = await fetchTanksData(propertyId);
                if (tankResult.error) {
                    setError(tankResult.error);
                } else {
                    setTankData(tankResult.data);
                }
            };

            fetchTankData();
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

    useEffect(() => {
        const division = searchParams.get('division') || '';
        const foreman = searchParams.get('foreman') || '';
        const route = searchParams.get('route') || '';
        const facility = searchParams.get('facility') || '';

        setSelectedDivision(division);
        setSelectedForeman(foreman);
        setSelectedRoute(route);
        setSelectedFacility(facility);
    }, [searchParams]);

    const updateUrlWithSelections = (params: Record<string, string>) => {
        const query = new URLSearchParams(params).toString();
        router.push(`?${query}`);
    };

    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, key: string) => (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setter(value);
        const newParams = {
            division: key === 'division' ? value : selectedDivision,
            foreman: key === 'foreman' ? value : selectedForeman,
            route: key === 'route' ? value : selectedRoute,
            facility: key === 'facility' ? value : selectedFacility,
        };
        updateUrlWithSelections(newParams);
    };

    const handleBackButton = (setter: React.Dispatch<React.SetStateAction<string>>, key: string) => () => {
        setter('');
        const newParams = {
            division: key === 'division' ? '' : selectedDivision,
            foreman: key === 'foreman' ? '' : selectedForeman,
            route: key === 'route' ? '' : '', // Reset route filter
            facility: key === 'route' ? '' : '', // Reset facility filter
        };
        updateUrlWithSelections(newParams);
    };
    

    const handleTankCardClick = (source_key: string, inchestoesd: number | null) => {
        const isEsd = inchestoesd !== null;
        const esdQuery = isEsd ? '?is-esd=true' : '';
        const tank_type = source_key.charAt(5);
        const tankTypeQuery = `?tank-type=${tank_type === '0' ? 'Oil' : 'Water'}`;
        
        let second_sk = '';
        if (isEsd) {
            second_sk = source_key.slice(0, 5) + "FAC";
        }

        const currentUrl = window.location.href;
        const finalUrl = isEsd 
            ? `/tank/${source_key}${tankTypeQuery}&${esdQuery}&second_sk=${second_sk}&returnUrl=${encodeURIComponent(currentUrl)}` 
            : `/tank/${source_key}${tankTypeQuery}&${esdQuery}&returnUrl=${encodeURIComponent(currentUrl)}`;
        
        router.push(finalUrl);
    };


    const divisionOptions = extractNames('division_name');
    const foremanOptions = extractNames('foreman_name', { division_name: selectedDivision });
    const routeOptions = extractNames('route_name', { division_name: selectedDivision, foreman_name: selectedForeman });
    const facilityOptions = extractNames('facility_name', { division_name: selectedDivision, foreman_name: selectedForeman, route_name: selectedRoute });

    const filteredTankData = tankData?.tanks.filter((tank) => {
        const facility = facData?.facilities.find(fac => fac.property_id === tank.property_id);
        return (
            (!selectedDivision || facility?.division_name === selectedDivision) &&
            (!selectedForeman || facility?.foreman_name === selectedForeman) &&
            (!selectedRoute || facility?.route_name === selectedRoute) &&
            (!selectedFacility || facility?.facility_name === selectedFacility)
        );
    });

    return (
        <SuspenseBoundary>
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', backgroundColor:'#282b30', width:'100%', paddingTop:'6px', paddingLeft:'10px', paddingBottom:'2px', boxShadow:'0px 10px 8px rgba(0, 0, 0, 0.1)' }}>
                    
                    {/* Division Selection */}
                    {selectedForeman || selectedRoute ? null : (
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', border: '10px', borderRadius: '25px', minWidth: '150px' }}>
                            {selectedDivision ? (
                                <>
                                    <ArrowBackIcon onClick={handleBackButton(setSelectedDivision, 'division')} sx={{ cursor: 'pointer', marginRight: '8px' }} />
                                    <Typography sx={{ fontSize: '12px' }}>{selectedDivision}</Typography>
                                </>
                            ) : (
                                <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px' }}>
                                    <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7' }}>Division name</InputLabel>
                                    <Select
                                        value={selectedDivision}
                                        onChange={handleChange(setSelectedDivision, 'division')}
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
                                    <ArrowBackIcon onClick={handleBackButton(setSelectedForeman, 'foreman')} sx={{ cursor: 'pointer', marginRight: '8px' }} />
                                    <Typography sx={{ fontSize: '12px' }}>{selectedForeman}</Typography>
                                </>
                            ) : (
                                <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px' }}>
                                    <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7' }}>Foreman name</InputLabel>
                                    <Select
                                        value={selectedForeman}
                                        onChange={handleChange(setSelectedForeman, 'foreman')}
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
                                    <ArrowBackIcon onClick={handleBackButton(setSelectedRoute, 'route')} sx={{ cursor: 'pointer', marginRight: '8px' }} />
                                    <Typography variant="body1" sx={{ fontSize: '12px' }}>{selectedRoute}</Typography>
                                </>
                            ) : (
                                <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px' }}>
                                    <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7' }}>Route name</InputLabel>
                                    <Select
                                        value={selectedRoute}
                                        onChange={handleChange(setSelectedRoute, 'route')}
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
                                    onChange={handleChange(setSelectedFacility, 'facility')}
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

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '65px' }}>
                    {(selectedDivision || selectedForeman || selectedRoute) && tankData && tankData.tanks.length > 0 ? (
                        <Grid container spacing={2} sx={{ flexWrap: 'wrap' }}>
                            {tankData && filteredTankData?.map((tank, index) => (
                                <Grid item key={index} xs={12} sm={6} md={4}>
                                    <div>{tank.property_id}</div>
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <TankCard tank={tank} onClick={() => handleTankCardClick(tank.source_key, tank.inches_to_esd)} />
                                    </Suspense>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="h6" sx={{ color: 'white' }}>Begin by selecting division to view tanks.</Typography>
                    )}
                </Box>
            </Box>
        </SuspenseBoundary>
    );
};

export default DataTransform;