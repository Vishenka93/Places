import Map, { Marker } from "react-map-gl";

import { useEffect, useState } from "react";
import { places } from "./consts/places";
import { cities } from "./consts/cities";
import { categories } from "./consts/categories";
import "mapbox-gl/dist/mapbox-gl.css";

console.log({ places });

function App() {
    const [currentCity, setCurrentCity] = useState(cities[0]);
    const [selectedType, setSelectedType] = useState(categories[0]);
    const [markers, setmarkers] = useState([]);
    const [viewState, setViewState] = useState({});

    useEffect(() => {
        const filteredPlaces = places.filter(
            ({ city, category }) =>
                (currentCity.name === "All" || currentCity.name === city) &&
                (selectedType === "All" || selectedType === category)
        );

        setmarkers(filteredPlaces);
    }, [currentCity, selectedType]);

    useEffect(() => {
        setViewState({
            zoom: currentCity.zoom,
            longitude: currentCity.coords.long,
            latitude: currentCity.coords.lat,
        });
    }, [currentCity]);

    return (
        <div className="body">
            <div className="selects">
                <select
                    value={currentCity.name}
                    onChange={(e) =>
                        setCurrentCity(
                            cities.find(({ name }) => name === e.target.value)
                        )
                    }
                >
                    {cities.map(({ id, name }) => (
                        <option value={name} key={id}>
                            {name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    {categories.map((cat) => (
                        <option value={cat} key={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {Object.keys(viewState).length !== 0 && (
                <Map
                    mapLib={import("mapbox-gl")}
                    {...viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    style={{ width: 500, height: 500 }}
                    mapStyle="mapbox://styles/mapbox/dark-v11"
                    mapboxAccessToken={import.meta.env.VITE_mapBoxToken}
                >
                    {markers.map(({ id, coords, icon }) => (
                        <Marker
                            key={id}
                            longitude={coords.long}
                            latitude={coords.lat}
                        >
                            <i className={icon}></i>
                        </Marker>
                    ))}
                </Map>
            )}
            <div className="legend">
                <i className="fa-solid fa-utensils"> Restaurants</i>
                <i className="fa-solid fa-beer-mug-empty"> Pub</i>
                <i className="fa-solid fa-mug-hot"> Coffee Bar</i>
            </div>
        </div>
    );
}

export default App;
// style={{
//     width: "20px",
//     height: "20px",
//     borderRadius: "50%",
//     background:
//         viewState.zoom > 10 ? "pink" : "black",
// }}
