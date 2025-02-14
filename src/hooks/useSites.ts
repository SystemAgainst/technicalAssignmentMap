import { ISite } from "@/types";


export const transformSites = (data: any[]): ISite[] =>
    data.map((site: any): ISite => ({
        ...site,
        latitude: parseFloat(site.latitude) || 0,
        longitude: parseFloat(site.longitude) || 0,
    }));