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

function App() {
    const [sites, setSites] = useState<ISite[]>([]);
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
                            const isSelected = selectedStop && selectedStop[0] === site.latitude && selectedStop[1] === site.longitude;

                            return site.latitude && site.longitude ? (
                                <Placemark
                                    key={index}
                                    geometry={[site.latitude, site.longitude]}
                                    properties={{
                                        hintContent: `ID: ${site.site_id}, Название: ${site.site_name}`,
                                    }}
                                    options={{
                                        preset: isSelected ? "islands#redIcon" : "islands#blueIcon",
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
