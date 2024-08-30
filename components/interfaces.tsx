export type Tank = {
    identifier: string | null;
    property_id: string;
    source_key: string;
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
    property_id: string;
    division_name: string;
    division_id: string;
    facility_name: string;
    route_name: string;
    foreman_name: string;
}

export type FacilityData = {
    facilities: Facility[];
}

export type RequestPayload = {
    property_ids: string[];
    tank_types: string[];
}

export type TankTs = {
    tank_metric: string;
    tank_type: string;
    uom: string;
    timestamps: Date[];
    values: number[];
}

export type TankTsData = {
    timeseries: TankTs[];
}

export type RequestPayloadTS = {
    source_key: string[];
}