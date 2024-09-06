'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { fetchFacilityData, fetchTanksData } from '../../../components/data_fetch';
import { TankData, FacilityData } from '../../../components/interfaces';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography, Grid, Button } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import SuspenseBoundary from '../../../components/suspense_boundary';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowNavigator from '../../../components/arrow_navigator';

const TankCard = lazy(() => import('../../../components/tank_card'));

export const DataTransform: React.FC = () => {
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

    const [chartTitle, setSelectedChartTitle] = useState<string>('');
  
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
            route: key === 'route' ? '' : selectedRoute,
            facility: key === 'facility' ? '' : selectedFacility,
        };
        updateUrlWithSelections(newParams);
    };

    const handleArrowClick = (setter: React.Dispatch<React.SetStateAction<string>>, key: string, options: string[], direction: 'left' | 'right') => () => {
        const currentValue = key === 'division' ? selectedDivision
                            : key === 'foreman' ? selectedForeman
                            : key === 'route' ? selectedRoute
                            : key === 'facility' ? selectedFacility
                            : '';
                                
        const currentIndex = options.indexOf(currentValue);
        let newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    
        // Wrap around the index if it goes out of bounds
        if (newIndex < 0) {
            newIndex = options.length - 1;
        } else if (newIndex >= options.length) {
            newIndex = 0;
        }
    
        const newValue = options[newIndex];
        setter(newValue);
        const newParams = {
            division: key === 'division' ? newValue : selectedDivision,
            foreman: key === 'foreman' ? newValue : selectedForeman,
            route: key === 'route' ? newValue : selectedRoute,
            facility: key === 'facility' ? newValue : selectedFacility,
        };
        updateUrlWithSelections(newParams);
    };
    
    const handleTankCardClick = (source_key: string, inchestoesd: number | null, tank: any, facilityName: string) => {
        const title = (`${facilityName} ${tank.tank_type} Tank ${tank.tank_number}`);
        setSelectedChartTitle(title)

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
            ? `/tank/${source_key}${tankTypeQuery}&${esdQuery}&second_sk=${second_sk}&returnUrl=${encodeURIComponent(currentUrl)}&chartTitle=${encodeURIComponent(title)}` 
            : `/tank/${source_key}${tankTypeQuery}&${esdQuery}&returnUrl=${encodeURIComponent(currentUrl)}&chartTitle=${encodeURIComponent(title)}`;
        
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

    const groupTanksByFacility = (tanks: TankData['tanks']) => {
        return tanks.reduce((grouped: Record<string, typeof tanks>, tank) => {
            const facility = facData?.facilities.find(fac => fac.property_id === tank.property_id); 
            const facilityName = facility?.facility_name!; 
            if (!grouped[facilityName]) {
                grouped[facilityName] = [];
            }
            grouped[facilityName].push(tank);
            return grouped;
        }, {});
    };

    const groupedTanks = filteredTankData ? groupTanksByFacility(filteredTankData) : {};

    return (
        <SuspenseBoundary>
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', backgroundColor: '#282b30', width: '100%', paddingTop: '15px', paddingLeft: '10px', 
                    paddingBottom: '2px', boxShadow: '0px 10px 8px rgba(0, 0, 0, 0.1)', justifyContent: 'center', position: 'relative' }}>

                    {/* GitHub & Docs */}
                    <Box sx={{ display: 'flex', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', flexWrap: 'wrap'}}>
                        <Button href="https://github.com/Jana-TT/tank_ui" sx={{display: 'flex', backgroundColor:'#1a1a1a', '&:hover': {outline: '1px solid #FFFFFF'} }}>
                            <img src="BigGithubLogo.svg" width={30}/>
                            <Typography sx={{color:'#BDD5E7', textDecoration: 'underline', marginLeft:'4px', textTransform: 'none'}}>UI Code</Typography>
                        </Button>

                        <Button href="https://github.com/Jana-TT/tank_project_2" sx={{display: 'flex', backgroundColor:'#1a1a1a', marginLeft:'10px', '&:hover': {outline: '1px solid #FFFFFF'} }}>
                            <img src="BigGithubLogo.svg" width={30}/>
                            <Typography sx={{color:'#BDD5E7', textDecoration: 'underline', marginLeft:'4px', textTransform: 'none'}}>API Code</Typography>
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', flexWrap: 'wrap' }}>
                        <Button href="https://tanks-api.wolfeydev.com/docs" sx={{ display: 'flex', backgroundColor: '#1a1a1a', marginLeft: '10px', '&:hover': {outline: '1px solid #009688'} }}>
                            <img src="FastAPI.svg" width={30} />
                            <Typography sx={{ color: '#BDD5E7', textDecoration: 'underline', marginLeft: '4px', textTransform: 'none' }}>
                                Docs
                            </Typography>
                        </Button>
                    </Box>


                    {/* Division Level */}
                    {selectedForeman || selectedRoute ? null : (
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', border: '10px', borderRadius: '25px', minWidth: '200px' }}>
                            {selectedDivision ? (
                                <>
                                    <div onClick={handleBackButton(setSelectedDivision, 'division')} style= {{display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight:'30px'}}>
                                        <ArrowBackIcon sx={{marginRight: '5px'}}/>
                                        <Typography variant="body1" sx={{ marginLeft: '2px', fontSize: '12px',  marginRight: '8px' }}>ALL</Typography>
                                    </div>    

                                    <ArrowNavigator
                                        labelChoice='Division name'
                                        options={divisionOptions}
                                        selectedOption={selectedDivision}
                                        onChange={handleChange(setSelectedDivision, 'division')}
                                        onArrowClick={handleArrowClick(setSelectedDivision, 'division', divisionOptions, 'right')}
                                    />
                                </>
                            ) : (
                                <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px', marginLeft: '10px' }}>  
                                    <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7', '&.Mui-focused': { color: '#FFFFFF' } }}>Division name</InputLabel>
                                    <Select
                                        value={selectedDivision}
                                        onChange={handleChange(setSelectedDivision, 'division')}
                                        sx={{ height: '30px', fontSize: '12px', padding: '8px', '.MuiSelect-icon': { color: 'white' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white', 
                                            borderWidth: '1px'
                                          } }}
                                        inputProps={{MenuProps: {disableScrollLock: true}}}
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
                    {selectedDivision && !selectedRoute && (
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', border: '10px', borderRadius: '25px', minWidth: '200px' }}>
                            {selectedForeman ? (
                                <>
                                    <div onClick={handleBackButton(setSelectedForeman, 'foreman')} style= {{display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight:'30px'}}>
                                        <ArrowBackIcon sx={{marginRight: '5px'}}/>
                                        <Typography variant="body1" sx={{ marginLeft: '2px', fontSize: '12px',  marginRight: '8px' }}>{selectedDivision}</Typography>
                                    </div>       

                                    <ArrowNavigator
                                        labelChoice='Foreman name'
                                        options={foremanOptions}
                                        selectedOption={selectedForeman}
                                        onChange={handleChange(setSelectedForeman, 'foreman')}
                                        onArrowClick={handleArrowClick(setSelectedForeman, 'foreman', foremanOptions, 'right')}
                                    />
                                </>
                            ) : (
                                <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px', marginLeft: '10px' }}>
                                    <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7', '&.Mui-focused': { color: '#FFFFFF' } }}>Foreman name</InputLabel>
                                    <Select
                                        value={selectedForeman}
                                        onChange={handleChange(setSelectedForeman, 'foreman')}
                                        sx={{ height: '30px', fontSize: '12px', padding: '8px', '.MuiSelect-icon': { color: 'white' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white', 
                                            borderWidth: '1px'
                                          }, }}
                                        inputProps={{MenuProps: {disableScrollLock: true}}}
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
                    {selectedForeman && !selectedFacility && (
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', border: '10px', borderRadius: '25px', minWidth: '200px' }}>
                            {selectedRoute ? (
                                <>
                                    <div onClick={handleBackButton(setSelectedRoute, 'route')} style= {{display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight:'30px'}}>
                                        <ArrowBackIcon sx={{marginRight: '5px'}}/>
                                        <Typography variant="body1" sx={{ marginLeft: '2px', fontSize: '12px',  marginRight: '8px' }}>{selectedForeman}</Typography>
                                    </div>
                            
                                    <ArrowNavigator
                                        labelChoice='Route name'
                                        options={routeOptions}
                                        selectedOption={selectedRoute}
                                        onChange={handleChange(setSelectedRoute, 'route')}
                                        onArrowClick={handleArrowClick(setSelectedRoute, 'route', routeOptions, 'right')}
                                    />
                                </>
                            ) : (
                                <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '100%', height: '30px', marginLeft: '10px' }}>
                                    <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7', '&.Mui-focused': { color: '#FFFFFF' } }}>Route name</InputLabel>
                                    <Select
                                        value={selectedRoute}
                                        onChange={handleChange(setSelectedRoute, 'route')}
                                        sx={{ height: '30px', fontSize: '12px', padding: '8px', '.MuiSelect-icon': { color: 'white' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white', 
                                            borderWidth: '1px'
                                          }, }}
                                        inputProps={{MenuProps: {disableScrollLock: true}}}
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
                                <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px', border: '10px', borderRadius: '25px', minWidth: '200px' }}>
                                    {selectedFacility ? (
                                        <>
                                            <div onClick={handleBackButton(setSelectedFacility, 'facility')} style= {{display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight:'30px'}}>
                                                <ArrowBackIcon sx={{marginRight: '5px'}}/>
                                                <Typography variant="body1" sx={{ marginLeft: '2px', fontSize: '12px' }}>{selectedRoute}</Typography>
                                            </div>

                                            <ArrowNavigator
                                                labelChoice='Facility name'
                                                options={facilityOptions}
                                                selectedOption={selectedFacility}
                                                onChange={handleChange(setSelectedFacility, 'facility')}
                                                onArrowClick={handleArrowClick(setSelectedFacility, 'facility', facilityOptions, 'right')}
                                            />
                                        </>
                                    ) : (
                                        <FormControl sx={{ backgroundColor:'#424549', borderRadius:'4px', width: '150px', height: '30px', marginLeft: '10px' }}>
                                            <InputLabel sx={{ fontSize: '12px', color:'#a4a7a7', marginBottom: '8px', '&.Mui-focused': { color: '#FFFFFF' } }}>Facility name</InputLabel>
                                            <Select
                                                value={selectedFacility}
                                                onChange={handleChange(setSelectedFacility, 'facility')}
                                                sx={{ height: '30px', fontSize: '12px', padding: '8px', '.MuiSelect-icon': { color: 'white' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'white', 
                                                    borderWidth: '1px'
                                                }, }}
                                                inputProps={{MenuProps: {disableScrollLock: true}}}
                                            >
                                                {facilityOptions.map((name, index) => (
                                                    <MenuItem key={index} value={name} sx={{ fontSize: '12px' }}>{name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                </Box>
                            )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '65px' }}>
                    {(selectedDivision || selectedForeman || selectedRoute) && tankData && tankData.tanks.length > 0 ? (
                        Object.entries(groupedTanks).map(([facilityName, tanks], facilityIndex) => (
                            <Box key={facilityIndex} sx={{ marginBottom: '20px' }}>
                                <Typography variant="h6" sx={{ color: 'white', marginBottom: '10px' }}>
                                    {facilityName}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
                                    {tanks.map((tank, index) => (
                                        <Box key={index} sx={{ width: '100%', maxWidth: '300px' }}>
                                            <Suspense fallback={<div>Loading...</div>}>
                                                <TankCard tank={tank} onClick={() => handleTankCardClick(tank.source_key, tank.inches_to_esd, tank, facilityName)} />
                                            </Suspense>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <div>
                            <Typography variant="h6" sx={{ color: 'white' }}>Begin by selecting a division to view tanks.</Typography>
                            <Typography variant="h6" sx={{ color: 'white' }}>At any selection level, you can press on a tank card to see its timeseries data.</Typography>
                        </div>
                    )}
                </Box>
            </Box>
        </SuspenseBoundary>
    );
};

export default DataTransform;
