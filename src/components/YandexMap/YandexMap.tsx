import styles from "./style.module.css";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { defaultState, modules } from "@/components/YandexMap/constants.ts";
import {
    getHintContent,
    getPlacemarkPreset,
} from "@/hooks";
import { useYandexMapData } from "@/components/YandexMap/useYandexMapData.ts";


export function YandexMap() {
    const { selectedStop, setSelectedStop, sites, isSiteLoading, costMap, isCostDataLoading } = useYandexMapData();
    // const [isLoading, setIsLoading] = useState(true);

    // if (isLoading || isSiteLoading || isCostDataLoading) {
    //     return <SkeletonPage />;
    // }

    return (
        <>
            <YMaps>
                <Map
                    defaultState={defaultState}
                    modules={modules}
                    onClick={() => setSelectedStop(null)}
                    className={styles.map}
                >
                    {sites.map((site, index) => {
                        const isSelected = selectedStop
                            ? selectedStop[0] === site.latitude && selectedStop[1] === site.longitude
                            : false;

                        const costInfo = costMap[Number(site.site_id)];

                        return (
                            <Placemark
                                key={index}
                                geometry={[site.latitude, site.longitude]}
                                properties={{ hintContent: getHintContent(site, costInfo) }}
                                options={{ preset: getPlacemarkPreset(isSelected, costInfo?.cost) }}
                                onClick={() => setSelectedStop([site.latitude, site.longitude])}
                            />
                        );
                    })}
                </Map>
            </YMaps>
        </>
    );
}