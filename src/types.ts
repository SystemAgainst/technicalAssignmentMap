export interface ISite {
    site_id: string;
    site_name: string;
    longitude: number;
    latitude: number;
}

export interface ICost {
    site_id_from: number;
    site_id_to: number;
    iwait: number;
    inveht: number;
    xwait: number;
    xpen: number;
    xnum: number;
    cost: number;
}

export type SelectedStopType = [number, number] | null;