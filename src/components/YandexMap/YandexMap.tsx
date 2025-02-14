import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { ICost, ISite, SelectedStopType, } from "@/types";
import { useFetchCSV } from "@/utils";
import {
    getHintContent,
    getPlacemarkPreset,
    transformCosts,
    transformSites,
} from "@/hooks";

/*
* TODO
*  [] make map for colors
*  [] types for hooks
*  [] more components?
*  [] main style
* */


export function YandexMap() {
    const [filteredCosts, setFilteredCosts] = useState<ICost[]>([]);
    const [selectedStop, setSelectedStop] = useState<SelectedStopType>(null);

    const { data: sites } = useFetchCSV<ISite>("/sites.csv", transformSites);
    const { data: costData } = useFetchCSV<ICost>("/costs.csv", transformCosts);

    const defaultState = {
        center: [55.782, 37.615],
        zoom: 15,
        controls: ["zoomControl", "fullscreenControl"],
    };

    useEffect(() => {
        console.log("loading...");
        if (!selectedStop) {
            setFilteredCosts([]);
            return;
        }

        const selectedSite = sites.find(
            (site) => site.latitude === selectedStop[0] && site.longitude === selectedStop[1]
        );

        if (!selectedSite) return;

        const costsForSelectedStop = costData.filter((cost) => cost.site_id_from === Number(selectedSite.site_id));

        setFilteredCosts(costsForSelectedStop);
    }, [selectedStop, costData, sites]);

    return (
        <>
            <h1>Работа с остановками</h1>
            <YMaps>
                <Map
                    defaultState={defaultState}
                    modules={["control.ZoomControl", "control.FullscreenControl", "geoObject.addon.hint"]}
                    onClick={() => setSelectedStop(null)}
                    className={styles.map}
                >
                    {sites.map((site, index) => {
                        const isSelected = selectedStop && selectedStop[0] === site.latitude &&
                            selectedStop[1] === site.longitude;

                        const costForFinalStop = filteredCosts.find(
                            (cost) => cost.site_id_to === Number(site.site_id)
                        );

                        return site.latitude && site.longitude ? (
                            <Placemark
                                key={index}
                                geometry={[site.latitude, site.longitude]}
                                properties={{
                                    hintContent: getHintContent(site, costForFinalStop),
                                }}
                                options={{
                                    preset: getPlacemarkPreset(isSelected, costForFinalStop ? costForFinalStop.cost : null),
                                }}
                                onClick={() => {
                                    setSelectedStop([site.latitude, site.longitude]);
                                }}
                            />
                        ) : null;
                    })}
                </Map>
            </YMaps>
        </>
    );
}
