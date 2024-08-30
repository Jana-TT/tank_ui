'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchTankTsData } from '../../../../components/data_fetch';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title } from 'chart.js';
import { TankTs, TankTsData } from '../../../../components/interfaces';
import { ChartOptions, ChartData, ChartDataset } from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

const generateDatasets = (tankTS: TankTs[], selectedTankType: string): ChartDataset<'line', number[]>[] => {
    const levelData = tankTS.find(ts => ts.tank_metric === "Level");
    const volumeData = tankTS.find(ts => ts.tank_metric === "Volume");
    const inchesUntilAlarmData = tankTS.find(ts => ts.tank_metric === "InchesUntilAlarm" && ts.tank_type === selectedTankType);

    // Construct the datasets only if corresponding data exists
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
            label: 'InchesUntilAlarm',
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

const LineChart: React.FC<{ tankTS: TankTs[], esd_source_key: string | null, tank_type_selected: string | null }> = ({ tankTS, esd_source_key, tank_type_selected }) => {
    const selectedTankType = tank_type_selected || 'DefaultTankType'; // Handle null case

    const timestamps = tankTS[0]?.timestamps.map(ts => ts.toLocaleString()) || [];
    const datasets = generateDatasets(tankTS, selectedTankType);

    // Type the data object
    const data: ChartData<'line', number[], string> = {
        labels: timestamps,
        datasets, // This will always be an array of ChartDataset<'line', number[]>
    };

    const options: ChartOptions<'line'> = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Timestamp',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Value',
                },
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw as number;
                        return `${tooltipItem.dataset.label}: ${value.toFixed(2)}`;
                    },
                },
            },
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Tank Metrics Over Time',
            },
        },
    };

    return <Line data={data} options={options} />;
};

const TankPage: React.FC = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    const source_key = Array.isArray(params.source_key) ? params.source_key[0] : params.source_key;
    const [tankTSdata, setTankTSdata] = useState<TankTsData | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const esd_source_key = searchParams.get('second_sk');
    const tank_type_selected = searchParams.get('tank-type');

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
        <div>
            <LineChart tankTS={tankTSdata.timeseries} esd_source_key={esd_source_key} tank_type_selected={tank_type_selected} />
        </div>
    );
};

export default TankPage;
