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
    onClick: () => void;
}

const TankCard: React.FC<TankCardProps> = ({tank, onClick}) => {

    return (
        <div>
            <Card onClick={onClick} sx={{marginBottom: '1rem', backgroundColor: '#191919', width: '100%', maxWidth: '300px', overflow: 'hidden', height: 'auto', boxShadow:'0px 8px 8px rgba(0, 0, 0, 0.1)', cursor: 'pointer'}}>
                <CardContent sx={{padding: '1rem', height: '100%'}}>
                    <Box sx={{display: 'flex', alignItems: 'flex-start', height: '100%'}}>
                        <Box sx={{ flex: '0 0 auto', width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                            <Typography sx={{ color: 'white'}}>{percent_full_tank(tank.percent_full, tank.tank_type, tank.capacity)}</Typography>
                        </Box>
                        <Box sx={{marginTop: '0.5rem', marginLeft: '0.5rem', flex: '1'}}>
                            <Typography sx={{fontSize: '0.95rem', textAlign: 'left', color: tank.tank_type == "Oil" ? '#5bb450' : '#33c7d8', fontWeight: 'bold'}}>
                                {tank.tank_type} Tank #{tank.tank_number}
                            </Typography>
                            <Typography sx={{fontSize: '0.95rem', color: 'white', textAlign: 'left'}}>Level: {convertToFeet(tank.level)}</Typography>
                            <Typography sx={{fontSize: '0.95rem', color: 'white', textAlign: 'left', marginBottom: '0.3rem'}}>Capacity: {tank.capacity} bbl</Typography>
                            <Box sx={{background:'#6495ED', width: 'fit-content', borderRadius: '2px'}}>
                                {tank.inches_to_esd !== null && (
                                    <Typography sx={{fontSize: '0.95rem', color: 'white', textAlign: 'left', padding: '0.2rem 0.5rem'}}>
                                        {convertToFeet(tank.inches_to_esd)} to ESD 
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
}

export default TankCard;
