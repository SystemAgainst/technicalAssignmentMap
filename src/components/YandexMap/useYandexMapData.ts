import { useFetchCSV } from "@/utils";
import { ICost, ISite, SelectedStopType } from "@/types";
import { useMemo, useState } from "react";
import { transformCosts, transformSites } from "@/hooks";

export function useYandexMapData() {
    const [selectedStop, setSelectedStop] = useState<SelectedStopType>(null);

    const { data: sites, isLoading: isSiteLoading } = useFetchCSV<ISite>("/sites.csv", transformSites);
    const { data: costData, isLoading: isCostDataLoading } = useFetchCSV<ICost>("/costs.csv", transformCosts);

    const selectedSite = useMemo(() => {
        return selectedStop
            ? sites.find((site) => site.latitude === selectedStop[0] && site.longitude === selectedStop[1])
            : null;
    }, [selectedStop, sites]);

    const filteredCosts = useMemo(() => {
        return selectedSite
            ? costData.filter((cost) => cost.site_id_from === Number(selectedSite?.site_id))
            : [];
    }, [selectedSite, costData]);

    const costMap = useMemo(() => {
        return filteredCosts.reduce((acc, cost) => {
            acc[cost.site_id_to] = cost;
            return acc;
        }, {} as Record<number, ICost | undefined>);
    }, [filteredCosts]);

    return {
        selectedStop,
        setSelectedStop,
        sites,
        isSiteLoading,
        costMap,
        isCostDataLoading
    };
}
