import { FacilityData, TankData, RequestPayload } from './interfaces';

type Result<T> = { data: T; error: null } | { data: null; error: Error };

export const fetchFacilityData = async (): Promise<Result<FacilityData>> => {
    const fac_response = await fetch('https://tank-project-2-glgjkoxnua-uc.a.run.app/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!fac_response.ok) {
        return {data: null, error: new Error(`Network response was not ok: ${fac_response.status} ${fac_response.statusText}`)};
    }

    const data: FacilityData = await fac_response.json();
    return {data, error: null};
};

export const fetchTankData = async (primoids: string[]): Promise<Result<TankData>> => {
    const req: RequestPayload = {primo_ids: primoids, tank_types: ["Oil", "Water"]};
    const tank_response = await fetch('https://tank-project-2-glgjkoxnua-uc.a.run.app/tanks', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req)
    });

    if (!tank_response.ok) {
        return {data: null, error: new Error(`Network response was not ok: ${tank_response.status} ${tank_response.statusText}`)};
    }

    const data: TankData = await tank_response.json();
    return {data, error: null};
};

