"use client"

import mapboxgl from '!mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
import { DBStork, DBTeam, DBUser, User } from '@/app/types';

mapboxgl.accessToken = `pk.eyJ1IjoiY2xldmVybmFtZSIsImEiOiJjbG5kbHRvZWIwNTFwMnJwa3V1ZDZiMWx3In0.5yAn8uCEgyQ5ky5fHNsPfg`;

export default function Map() {

    //get stork data
    //plot on map with mapbox

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    const [storks, setStorks] = useState<DBStork[]>([]);

    useEffect(() => {
        if (map.current) {
            return;
        } // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });
    });

    return <div className="fullscreen">
        <br></br>
        <div className="justify-center items-center flex fullscreen">
            <div ref={mapContainer} onClick={()=>{console.log("here!!!")}}className="background"/>
        </div>
    </div>;
}