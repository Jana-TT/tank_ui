import { FacilityData, TankData, RequestPayload, TankTsData, RequestPayloadTS } from './interfaces';

type Result<T> = { data: T; error: null } | { data: null; error: Error };

export const fetchFacilityData = async (): Promise<Result<FacilityData>> => {
    const fac_response = await fetch('https://tanks-api.wolfeydev.com/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!fac_response.ok) {
        return {data: null, error: new Error(`Network response was not ok: ${fac_response.status} ${fac_response.statusText}`)};
    }

    const data: FacilityData = await fac_response.json();
    return {data, error: null};
};


export const fetchTanksData = async (propertyIds: string[]): Promise<Result<TankData>> => {
    const req: RequestPayload = { property_ids: propertyIds, tank_types: ["Oil", "Water"] };
    const tankResponse = await fetch('https://tanks-api.wolfeydev.com/tanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
    });

    if (!tankResponse.ok) {
        return { data: null, error: new Error(`Network response was not ok: ${tankResponse.status} ${tankResponse.statusText}`) };
    }

    const data: TankData = await tankResponse.json();
    return { data, error: null };
};


export const fetchTankTsData = async (sourceKeys: string[]): Promise<Result<TankTsData>> => {
    const req_tank_ts: RequestPayloadTS = {source_key: sourceKeys};
    const ts_response = await fetch('https://tanks-api.wolfeydev.com/tanks_timestamps', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req_tank_ts)
    })

    if (!ts_response.ok) {
        return {data: null, error: new Error(`Network response was not ok: ${ts_response.status} ${ts_response.statusText}`)};
    }

    const data: TankTsData = await ts_response.json();
    return {data, error: null};
}