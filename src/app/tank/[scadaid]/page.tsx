'use client';

import { useParams } from 'next/navigation';

const TankPage = () => {
    const params = useParams();
    
    // Check if params is null or if scadaid is missing
    if (!params || !params.scadaid) {
        return <div>Error: SCADA ID not found.</div>;
    }

    const scadaid = params.scadaid as string;

    return (
        <div>
            <h1>PP</h1>
            <p>SCADA ID: {scadaid}</p>
        </div>
    );
};

export default TankPage;
