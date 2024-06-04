'use client';
import React, { useState, useEffect } from 'react';

interface RequestPayload {
    primo_ids: string[];
    tank_types: string[];
}

const DataFetchingComponent = () => {
    const [data, setData] = useState(null);
    const [error] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const req: RequestPayload = { primo_ids: ["69419"], tank_types: ["Oil"]}; // my request payload
                const response = await fetch('https://tank-project-2-glgjkoxnua-uc.a.run.app/tanks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(req)
                });

                console.log('Response:', response);

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                setData(result);
                
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        
        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Fetched Data wee:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default DataFetchingComponent;
