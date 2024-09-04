'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchTankTsData } from '../../../../components/data_fetch';
import { Chart, Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title } from 'chart.js';
import { TankTs, TankTsData } from '../../../../components/interfaces';
import { ChartOptions, ChartData, ChartDataset } from 'chart.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

// Registering the Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

const generateDatasets = (tankTS: TankTs[], selectedTankType: string): ChartDataset<'line', number[]>[] => {
    const levelData = tankTS.find(ts => ts.tank_metric === "Level");
    const volumeData = tankTS.find(ts => ts.tank_metric === "Volume");
    const inchesUntilAlarmData = tankTS.find(ts => ts.tank_metric === "InchesUntilAlarm" && ts.tank_type === selectedTankType);

    // make the datasets only if corresponding data exists
    const datasets: ChartDataset<'line', number[]>[] = [];

    if (levelData) {
        datasets.push({
            label: 'Level',
            data: levelData.values,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.4)',
            fill: false,
            pointStyle: 'circle',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: 'rgba(75,192,192,0.4)',
            pointRadius: 5,
            pointHoverRadius: 7,
        });
    }

    if (volumeData) {
        datasets.push({
            label: 'Volume',
            data: volumeData.values,
            borderColor: 'rgba(153,102,255,1)',
            backgroundColor: 'rgba(153,102,255,0.4)',
            fill: false,
            pointStyle: 'circle',
            pointBorderColor: 'rgba(153,102,255,1)',
            pointBackgroundColor: 'rgba(153,102,255,0.4)',
            pointRadius: 5,
            pointHoverRadius: 7,
        });
    }

    if (inchesUntilAlarmData) {
        datasets.push({
            label: 'Inches Until ESD',
            data: inchesUntilAlarmData.values,
            borderColor: 'rgba(255,99,132,1)',
            backgroundColor: 'rgba(255,99,132,0.4)',
            fill: false,
            pointStyle: 'circle',
            pointBorderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,0.4)',
            pointRadius: 5,
            pointHoverRadius: 7,
        });
    }

    return datasets;
};

const LineChart: React.FC<{ tankTS: TankTs[], tank_type_selected: string | null, chartTitle: string }> = ({ tankTS, tank_type_selected, chartTitle }) => {
    const selectedTankType = tank_type_selected || 'DefaultTankType'; // Handle null case

    // Converting timestamps to local strings
    const timestamps = tankTS[0]?.timestamps.map(ts => new Date(ts).toLocaleString()) || [];
    const datasets = generateDatasets(tankTS, selectedTankType);

    // Type the data object so I don't get TypeScript errors
    const data: ChartData<'line', number[], string> = {
        labels: timestamps,
        datasets, // This will always be an array of ChartDataset<'line', number[]>
    };

    const options = (chartTitle: string): ChartOptions<'line'> => ({
        responsive: true, 
        maintainAspectRatio: true,
        scales: {
            x: {
                grid: {
                    color: '#282b30', // Set the color of the grid lines for the x-axis
                },
                title: {
                    display: true,
                    text: 'Timestamp',
                    color: '#FFFFFF'
                },
            },
            y: {
                grid: {
                    color: '#282b30', // Set the color of the grid lines for the x-axis
                },
                title: {
                    display: true,
                    text: 'Value',
                    color: '#FFFFFF'
                },
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw as number;
                        const units = {
                            'Level': 'in',
                            'Volume': 'bbl',
                            'Inches Until ESD': 'in'
                        };
                        const unit = units[tooltipItem.dataset.label as keyof typeof units] || 'unit';
                        return `${tooltipItem.dataset.label}: ${value.toFixed(2)} ${unit}`;
                    },
                },
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: 'white', 
                    font: {
                        size: 12, 
                    },
            },
        },
            title: {
                display: true,
                text: chartTitle, 
                color: '#FFFFFF',
                font: {
                    size: 16, 
                }
            },
        },
    });
    
    return <Line data={data} options={options(chartTitle || 'Default Chart Title')} />;
};

const TankPage: React.FC = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const source_key = Array.isArray(params.source_key) ? params.source_key[0] : params.source_key;
    const [tankTSdata, setTankTSdata] = useState<TankTsData | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const esd_source_key = searchParams.get('second_sk');
    const tank_type_selected = searchParams.get('tank-type');

    const chartTitle = searchParams.get('chartTitle') || 'Default Chart Title'; // default title if no exist
    const chartTitle_lower = chartTitle.toUpperCase()


    const returnUrl = searchParams.get('returnUrl') || '/';

    useEffect(() => {
        const fetchData = async () => {
            const source_keys = esd_source_key ? [source_key, esd_source_key] : [source_key];
            const result = await fetchTankTsData(source_keys);
            if (result.error) {
                setError(result.error);
            } else {
                setTankTSdata(result.data);
            }
        };

        fetchData();

    }, [source_key, esd_source_key]);

    if (error) return <p>Error: {error.message}</p>;
    if (!tankTSdata || tankTSdata.timeseries.length < 2) return <p>Loading...</p>;

    return (
        <div style={{ position: 'fixed', height: '100vh', width: '100vw' }}>
            <Link href={returnUrl}>
                <ArrowBackIcon sx={{ position: 'absolute', left: '16px', cursor: 'pointer', fontSize: '3rem', marginTop: '16px'}} />
            </Link>
            <div style={{ height: 'calc(100% - 32px)', width: '100%', maxWidth: '100%', marginTop: '32px' }}>
                <LineChart tankTS={tankTSdata.timeseries} tank_type_selected={tank_type_selected} chartTitle={chartTitle_lower} />
            </div>
        </div>
    );
};

export default TankPage;
