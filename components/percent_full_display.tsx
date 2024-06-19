import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function percent_full_tank(percent_full: number, tank_type: string, capacity: number) {
    return(
        <div>
            <Box sx={{width: 30, height: 50, border: '1.5px solid #e0e0e0',borderRadius: '25px',overflow: 'hidden',position: 'relative',backgroundColor: 'fcfbfc'}}>
                <Typography  sx={{ fontSize: '0.8rem', textAlign: 'center', position: 'absolute', width: '100%', top: '50%', transform: 'translateY(-50%)', zIndex: 1, fontWeight: 'bold'}}>{percent_full}%</Typography>
                <Box sx={{zIndex: 0, position: 'absolute', bottom: 0, width: '100%', height: `${percent_full}%`, backgroundColor: tank_type == "Oil" ? '#5bb450' : '#33c7d8'}}/> 
            </Box>
            <Typography>{capacity}</Typography>
        </div>
    )
}

//first box is the outline, second is the fill