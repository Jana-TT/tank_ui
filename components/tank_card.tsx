import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Tank } from './interfaces';
import { convertToFeet } from './inches_to_feet';
import { percent_full_tank } from './percent_full_display';
import Box from '@mui/material/Box';

type TankCardProps =  {
    tank: Tank;
}

const TankCard: React.FC<TankCardProps> = ({tank}) => {
    return (
        <div>
            <Card sx={{marginBottom: 2, backgroundColor: '#191919', width: '180px', overflow: 'hidden', height: '110px'}}>
                <CardContent sx={{padding: '8px', height: '100%'}}>
                    <Box sx={{display: 'flex', alignItems: 'flex-start', height: '100%'}}>
                        <Box sx={{ width: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                            <Typography sx={{ color: 'white'}}>{percent_full_tank(tank.percent_full, tank.tank_type, tank.capacity)}</Typography>
                        </Box>
                        <Box sx={{marginTop: 1, marginLeft: 1}}>
                            <Typography sx={{fontSize: '0.90rem', textAlign: 'left',color: tank.tank_type == "Oil" ? '#5bb450' : '#33c7d8', fontWeight: 'bold'}}>{tank.tank_type} Tank #{tank.tank_number}</Typography>
                            <Typography sx={{fontSize: '0.90rem', color: 'white', textAlign: 'left'}}>Level: {convertToFeet(tank.level)}</Typography>
                            <Typography sx={{fontSize: '0.90rem', color: 'white', textAlign: 'left', marginBottom: 0.3}}>Capacity: {tank.capacity} bbl</Typography>
                            <Box sx={{background:'#6495ED', width: 'fit-content', borderRadius: '2px'}}>
                                {tank.inches_to_esd !== null && (<Typography sx={{fontSize: '0.90rem', color: 'white', textAlign: 'left', marginRight: 0.5, marginLeft: 0.5}}>{convertToFeet(tank.inches_to_esd)} to ESD</Typography>)} 
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
}

export default TankCard;


