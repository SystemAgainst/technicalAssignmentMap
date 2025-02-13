import './App.css'
import { useEffect, useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { parse } from "papaparse";

interface ISite {
    site_id: string;
    site_name: string;
    longitude: number;
    latitude: number;
}

interface ICost {
    site_id_from: number;
    site_id_to: number;
    iwait: number;
    inveht: number;
    xwait: number;
    xpen: number;
    xnum: number;
    cost: number;
}

function App() {
    const [sites, setSites] = useState<ISite[]>([]);
    const [costData, setCostData] = useState<ICost[]>([]);
    const [filteredCosts, setFilteredCosts] = useState<ICost[]>([]);
    const [selectedStop, setSelectedStop] = useState<[number, number] | null>(null);

    const defaultState = {
        center: [55.782, 37.615],
        zoom: 15,
        controls: ["zoomControl", "fullscreenControl"],
    };

    useEffect(() => {
        fetch("/sites.csv")
            .then((response) => response.text())
            .then((csvText) => {
                const parsedData = parse(csvText, { header: true, skipEmptyLines: true, delimiter: ";" });

                const formattedData = parsedData.data.map((site: any): ISite => ({
                    ...site,
                    latitude: parseFloat(site.latitude) || 0,
                    longitude: parseFloat(site.longitude) || 0,
                }));

                setSites(formattedData);
            });
    }, []);

    useEffect(() => {
        fetch("/costs.csv")
            .then((response) => response.text())
            .then((csvText) => {
                const parsedData = parse(csvText, { header: true, skipEmptyLines: true, delimiter: ";" });

                const formattedData = parsedData.data.map((cost: any): ICost => ({
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

                setCostData(formattedData);
            });
    }, []);

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

        console.log("Фильтрованные маршруты для остановки:", selectedSite.site_id, costsForSelectedStop);
        setFilteredCosts(costsForSelectedStop);
    }, [selectedStop, costData, sites]);

    const getColorByCost = (cost: number) => {
        switch (true) {
            case cost <= 5 && cost > 0:
                return "islands#greenIcon";
            case cost > 5 && cost <= 15:
                return "islands#yellowIcon";
            case cost > 15 && cost <= 30:
                return "islands#redIcon";
            case cost > 30:
                return "islands#violetIcon";
            default:
                return "islands#blackIcon"; // Если нет маршрута
        }
    };

    const getPlacemarkPreset = (isSelected: boolean, cost: number | null) => {
        if (isSelected) {
            return "islands#blueIcon"; // Выбранная остановка
        }
        return getColorByCost(cost ?? -1); // Окрашивание по стоимости
    };

    return (
        <>
            <div className="card">
                <YMaps>
                    <Map
                        style={{ height: "80vh", width: "80vw" }}
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
                                        hintContent: costForFinalStop
                                            ? `ID: ${site.site_id}, Название: ${site.site_name}
                                                \nЗатраты: ${costForFinalStop.cost} мин.
                                                \nОжидание: ${costForFinalStop.iwait} мин.
                                                \nВремя в салоне: ${costForFinalStop.inveht} мин.
                                                \nПересадки: ${costForFinalStop.xnum}
                                                \nШтраф: ${costForFinalStop.xpen}`
                                            : `ID: ${site.site_id}, Название: ${site.site_name}`,
                                    }}
                                    options={{
                                        preset: getPlacemarkPreset(isSelected, costForFinalStop ? costForFinalStop.cost : null),
                                    }}
                                    onClick={() => {
                                        setSelectedStop([site.latitude, site.longitude]);
                                        console.log("Выбранная точка:", [site.latitude, site.longitude]);
                                    }}
                                />
                            ) : null;
                        })}
                    </Map>
                </YMaps>
            </div>
        </>
    );
}

export default App;
