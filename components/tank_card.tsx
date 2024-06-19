import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Tank } from './interfaces';
import { convertToFeet } from './inches_to_feet';
import { percent_full_tank } from './percent_full_display';
import Box from '@mui/material/Box';

interface TankCardProps {
    tank: Tank;
}

const TankCard: React.FC<TankCardProps> = ({ tank }) => {
    return (
        <Card variant="outlined" sx={{ marginBottom: 2, backgroundColor: '#191919', width: '200px'}}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center'}}>

                    <Box sx={{ width: '50px', height: 'auto', marginRight: '16px' }}>
                        <Typography sx={{ color: 'white' }}>{percent_full_tank(tank.percent_full, tank.tank_type, tank.Capacity)}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ color: 'white', textAlign: 'right'}}>{tank.tank_type} Tank #{tank.tank_number}</Typography>
                        <Typography sx={{ color: 'white', textAlign: 'right'}}>Capacity: {tank.Capacity}</Typography>
                        <Typography sx={{ color: 'white', textAlign: 'left'}}>Level: {convertToFeet(tank.Level)}</Typography>
                        <Typography sx={{ color: 'white', textAlign: 'right'}}>Volume: {tank.Volume} bbl</Typography>
                        {tank.InchesToESD !== null && (<Typography sx={{ color: 'white', textAlign: 'right'}}>{convertToFeet(tank.InchesToESD)} to ESD</Typography>)}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default TankCard;


//<Typography sx={{ color: 'white' }}>{tank.primo_id}</Typography>