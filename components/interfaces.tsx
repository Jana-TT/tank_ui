export interface Tank {
    primo_id: string;
    tank_type: string;
    tank_number: number;
    Level: number;
    Volume: number;
    InchesToESD: number | null;
    TimeUntilESD: number | null;
    Capacity: number;
    percent_full: number;
}

export interface TankData {
    tanks: Tank[];
}

export interface Facility {
    primo_id: string;
    division_name: string;
    division_id: string;
    entity_type: string;
    entity_name: string;
}

export interface FacilityData {
    facilities: Facility[];
}

export interface RequestPayload {
    primo_ids: string[];
    tank_types: string[];
}