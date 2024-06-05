import Box from '@mui/material/Box';

export function percent_full_tank(percent_full: number, tank_type: string) {
    return(
        <Box sx={{width: 25, height: 40,border: '1.5px solid #e0e0e0',borderRadius: '25px',overflow: 'hidden',position: 'relative',backgroundColor: 'fcfbfc'}}>
            <Box sx={{position: 'absolute', bottom: 0, width: '100%', height: `${percent_full}%`, backgroundColor: tank_type == "Oil" ? '#5bb450' : '#33c7d8'}}/>
        </Box>
    )
}


