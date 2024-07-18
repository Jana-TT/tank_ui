'use client';

import { fetchFacilityData, fetchTankData } from '../../components/data_fetch';
import { TankData, FacilityData } from '../../components/interfaces';
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const Poopie = () => {
    const [facData, setFacData] = useState<FacilityData | null>(null);
    const [tankData, setTankData] = useState<TankData | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const [selectedFilters, setSelectedFilters] = useState<string[]>(['division', 'foreman', 'route', 'facility', 'well']);
    const [filterValues, setFilterValues] = useState<{ [key: string]: string }>({});
    
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchFacilityDataAsync = async () => {
            const facResult = await fetchFacilityData();
            if (facResult.error) {
                setError(facResult.error);
            } else {
                setFacData(facResult.data);
            }
        };

        fetchFacilityDataAsync();
    }, []);

    useEffect(() => {
        const fetchTankDataAsync = async () => {
            const tankResult = await fetchTankData(['69419', '98750', '98743']);
            if (tankResult.error) {
                setError(tankResult.error);
            } else {
                setTankData(tankResult.data);
            }
        };

        fetchTankDataAsync();
    }, []);

    const availableFilters = ['division', 'foreman', 'route', 'facility', 'well']; // Add more properties as needed

    const handleFilterChange = (filter: string) => (event: SelectChangeEvent<string>) => { //material ui used for change events in MUI's Select component
        setFilterValues(prevValues => ({
            ...prevValues,
            [filter]: event.target.value as string,
        }));
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleFilterSelectionChange = (filter: string) => (event: React.ChangeEvent<HTMLInputElement>) => { //provided by React for handling change events on HTML input elements 
        if (event.target.checked) {
            setSelectedFilters(prevFilters => [...prevFilters, filter]);
        } else {
            setSelectedFilters(prevFilters => prevFilters.filter(f => f !== filter));
        }
    };

    const renderFilterSelect = (filter: string, options: string[]) => (
        <FormControl sx={{ backgroundColor: 'gray', width: '150px', height: '30px', margin: '5px' }} key={filter}>
            <InputLabel sx={{ fontSize: '12px' }}>{`Select ${filter}`}</InputLabel>
            <Select
                value={filterValues[filter] || ''}
                onChange={handleFilterChange(filter)}
                sx={{ height: '30px', fontSize: '12px', padding: '8px' }}
            >
                {options.map((option, index) => (
                    <MenuItem key={index} value={option} sx={{ fontSize: '12px' }}>{option}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    const divisionNames = facData?.facilities.map(facility => facility.division_name) || [];
    const foremanNames = facData?.facilities.map(foreman_names => foreman_names.foreman_name) || [];
    const routeNames = facData?.facilities.map(route_name => route_name.route_name) || []
    const facilityNames = facData?.facilities.map(facility_names => facility_names.entity_name) || [];
    const wellNames = ["Well1", "Well2", "Well3"]; // Replace with actual data

    const filterOptions: { [key: string]: string[] } = {
        division: divisionNames,
        foreman: foremanNames,
        route: routeNames,
        facility: facilityNames,
        well: wellNames,
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
                <MenuIcon />
            </IconButton>

            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
                <Box sx={{ width: 250, padding: '10px' }}>
                    <Typography variant="h6">Select Filters</Typography>
                    {availableFilters.map(filter => (
                        <FormControlLabel
                            key={filter}
                            control={
                                <Checkbox
                                    checked={selectedFilters.includes(filter)}
                                    onChange={handleFilterSelectionChange(filter)}
                                    name={filter}
                                />
                            }
                            label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                        />
                    ))}
                </Box>
            </Drawer>

            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedFilters.map(filter => renderFilterSelect(filter, filterOptions[filter]))}
            </Box>
        </Box>
    );
};

export default Poopie;

