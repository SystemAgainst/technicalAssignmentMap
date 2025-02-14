import {useEffect, useMemo, useState} from "react";
import styles from "./style.module.css";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { ICost, ISite, SelectedStopType } from "@/types";
import { useFetchCSV } from "@/utils";
import { SkeletonPage } from "@/components";
import { defaultState, modules } from "@/components/YandexMap/constants.ts";
import {
    getHintContent,
    getPlacemarkPreset,
    transformCosts,
    transformSites,
} from "@/hooks";


export function YandexMap() {
    const [selectedStop, setSelectedStop] = useState<SelectedStopType>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { data: sites, isLoading: isSiteLoading } = useFetchCSV<ISite>("/sites.csv", transformSites);
    const { data: costData, isLoading: isCostDataLoading } = useFetchCSV<ICost>("/costs.csv", transformCosts);

    const selectedSite = useMemo(() => {
        return selectedStop
            ? sites.find((site) => site.latitude === selectedStop[0] && site.longitude === selectedStop[1])
            : null;
    }, [selectedStop, sites]);

    const filteredCosts = useMemo(() => {
        return selectedStop
            ? costData.filter((cost) => cost.site_id_from === Number(selectedSite?.site_id))
            : [];
    }, [selectedStop, costData]);

    const costMap = useMemo(() => {
        return filteredCosts.reduce((acc, cost) => {
            acc[cost.site_id_to] = cost;
            return acc;
        }, {} as Record<number, ICost | undefined>);
    }, [filteredCosts]);

    useEffect(() => {
        const skeletonTimer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => {
            clearTimeout(skeletonTimer);
        };
    }, []);

    if (isLoading || isSiteLoading || isCostDataLoading) {
        return <SkeletonPage />;
    }

    return (
        <>
            <YMaps>
                <Map
                    defaultState={defaultState}
                    modules={modules}
                    onClick={() => setSelectedStop(null)}
                    className={styles.map}
                >
                    {sites.map((site, index) => (
                        <Placemark
                            key={index}
                            geometry={[site.latitude, site.longitude]}
                            properties={{ hintContent: getHintContent(site, costMap[Number(site.site_id)]) }}
                            options={{ preset: getPlacemarkPreset(selectedStop && selectedStop[0] === site.latitude, costMap[Number(site.site_id)]?.cost) }}
                            onClick={() => setSelectedStop([site.latitude, site.longitude])}
                        />
                    ))}
                </Map>
            </YMaps>
        </>
    );
}