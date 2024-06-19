import { FacilityData, TankData, RequestPayload } from './interfaces';

export const fetchFacilityData = async (): Promise<FacilityData> => {
    const fac_res = await fetch('https://tank-project-2-glgjkoxnua-uc.a.run.app/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!fac_res.ok) {
        throw new Error(`Network response was not ok: ${fac_res.status} ${fac_res.statusText}`);
    }

    return await fac_res.json();
};

export const fetchTankData = async (primoid: string[]): Promise<TankData> => {
    const req: RequestPayload = { primo_ids: primoid, tank_types: ["Oil", "Water"] };
    const response = await fetch('https://tank-project-2-glgjkoxnua-uc.a.run.app/tanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

