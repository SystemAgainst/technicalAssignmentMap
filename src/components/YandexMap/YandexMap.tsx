import { useEffect, useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { ICost, ISite, SelectedStopType, } from "../../types.ts";
import { useFetchCSV } from "../../utils";
import { getHintContent, getPlacemarkPreset } from "../../hooks";
import styles from "./style.module.css";

/*
* TODO
*  [] make map for colors
*  [] types for hooks
*  [] more components?
*  [] main style
* */


// Функция преобразования данных для остановок
const transformSites = (data: any[]): ISite[] =>
    data.map((site: any): ISite => ({
        ...site,
        latitude: parseFloat(site.latitude) || 0,
        longitude: parseFloat(site.longitude) || 0,
    }));

// Функция преобразования данных для стоимости
const transformCosts = (data: any[]): ICost[] =>
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
        <div className={styles.yandexMap}>
            <YMaps>
                <Map
                    style={{height: "80vh", width: "80vw"}}
                    defaultState={defaultState}
                    modules={["control.ZoomControl", "control.FullscreenControl", "geoObject.addon.hint"]}
                    onClick={() => setSelectedStop(null)}
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
        </div>
    );
}
