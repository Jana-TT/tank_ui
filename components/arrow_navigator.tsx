import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ArrowNavigatorProps {
    labelChoice: string;
    options: string[];
    selectedOption: string;
    onChange: (event: SelectChangeEvent<string>) => void;
    onArrowClick: (direction: 'left' | 'right') => void;
}

const ArrowNavigator: React.FC<ArrowNavigatorProps> = ({ labelChoice, options, selectedOption, onChange, onArrowClick }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => onArrowClick('left')} sx={{ marginRight: '8px' }}>
                <ArrowBackIcon />
            </IconButton>
            <FormControl fullWidth>
                <InputLabel>{labelChoice}</InputLabel>
                <Select
                    value={selectedOption}
                    onChange={onChange}
                    sx={{ height: '30px' }}
                >
                    {options.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <IconButton onClick={() => onArrowClick('right')} sx={{ marginLeft: '8px' }}>
                <ArrowForwardIcon />
            </IconButton>
        </Box>
    );
};

export default ArrowNavigator;
