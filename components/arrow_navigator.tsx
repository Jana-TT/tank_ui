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
                <ArrowBackIcon sx={{ color: 'white' }} />
            </IconButton>
            <FormControl sx={{ width: '160px' }}> 
                <InputLabel sx={{ color: '#a4a7a7', transform: selectedOption ? 'translate(0, -15px) scale(0.75)' : 'translate(0, 0)',  '&.Mui-focused': { color: '#FFFFFF' } }}>{labelChoice}</InputLabel>
                <Select
                    value={selectedOption}
                    onChange={onChange}
                    sx={{ 
                        height: '30px', 
                        fontSize: '12px', 
                        color: 'white', 
                        backgroundColor: '#424549', 
                        '.MuiSelect-icon': { color: 'white' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white', 
                            borderWidth: '1px'
                          },
                        width: '100%'
                    }}
                    inputProps={{ MenuProps: { disableScrollLock: true } }}
                >
                    {options.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <IconButton onClick={() => onArrowClick('right')} sx={{ marginLeft: '8px' }}>
                <ArrowForwardIcon sx={{ color: 'white' }} />
            </IconButton>
        </Box>
    );
};

export default ArrowNavigator;
