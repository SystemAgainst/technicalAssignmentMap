import { ICost } from "@/types";


export const transformCosts = (data: any[]): ICost[] =>
    data.map((cost: any): ICost => ({
        ...cost,
        site_id_from: Number(cost.site_id_from),
        site_id_to: Number(cost.site_id_to),
        iwait: parseFloat(cost.iwait) || 0,
        inveht: parseFloat(cost.inveht) || 0,
        xwait: parseFloat(cost.xwait) || 0,
        xpen: parseFloat(cost.xpen) || 0,
        xnum: parseFloat(cost.xnum) || 0,
        cost: parseFloat(cost.cost) || 0,
    }));