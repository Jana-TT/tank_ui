export type Tank = {
    primo_id: string;
    tank_type: string;
    tank_number: number;
    level: number;
    volume: number;
    inches_to_esd: number | null;
    time_until_esd: number | null;
    capacity: number;
    percent_full: number;
}

export type TankData = {
    tanks: Tank[];
}

export type Facility = {
    primo_id: string;
    division_name: string;
    division_id: string;
    entity_type: string;
    entity_name: string;
    route_name: string;
    foreman_name: string;
}

export type FacilityData = {
    facilities: Facility[];
}

export type RequestPayload = {
    primo_ids: string[];
    tank_types: string[];
}