import './App.css'
import { useEffect, useRef, useState, } from "react";
import { YMaps, Map, Placemark, } from "@pbe/react-yandex-maps";
import { parse } from "papaparse";


interface Site {
    site_id: string;
    site_name: string;
    longitude: number;
    latitude: number;
}

function App() {
    const mapRef = useRef<any>(null);

    const [sites, setSites] = useState<Site[]>([]);
    const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

    const defaultState = {
        center: [55.782, 37.615],
        zoom: 15,
        controls: ["zoomControl", "fullscreenControl"],
    };

    useEffect(() => {
        fetch("/sites.csv")
            .then((response) => response.text())
            .then((csvText) => {
                const parsedData = parse(
                    csvText,
                    { header: true, skipEmptyLines: true, delimiter: ";" }
                );
                console.log(parsedData);
                const formattedData = parsedData.data.map((site: any): Site => ({
                    ...site,
                    latitude: parseFloat(site.latitude) || 0,
                    longitude: parseFloat(site.longitude) || 0,
                }));
                setSites(formattedData);
            });
    }, []);

    // const handlePlacemarkClick = (site: Site) => {
    //     setSelectedCoords([site.latitude, site.longitude]);
    //     console.log("Выбранная точка:", [site.latitude, site.longitude]);
    // }

    return (
        <>
            <div className="card">
                <YMaps>
                    <Map
                        instanceRef={mapRef}
                        defaultState={defaultState}
                        modules={["control.ZoomControl", "control.FullscreenControl"]}
                        onClick={() => {}}
                    >
                        {sites.map((site, index) => (
                            site.latitude && site.longitude ? (
                                <Placemark
                                    key={index}
                                    geometry={[site.latitude, site.longitude]}
                                    properties={{ hintContent: site.site_name }}
                                    onClick={() => {
                                        setSelectedCoords([site.latitude, site.longitude]);
                                        console.log("Выбранная точка:", [site.latitude, site.longitude]);
                                    }}
                                />
                            ) : null
                        ))}
                    </Map>
                </YMaps>
            </div>
        </>
    )
}

export default App
