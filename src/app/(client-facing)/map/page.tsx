"use client"

import mapboxgl from '!mapbox-gl';
import React, { useRef, useEffect, useState } from 'react';
import { DBStork, DBTeam, DBUser, User } from '@/app/types';

var wc = require('which-country');

mapboxgl.accessToken = `pk.eyJ1IjoiY2xldmVybmFtZSIsImEiOiJjbG5kbHRvZWIwNTFwMnJwa3V1ZDZiMWx3In0.5yAn8uCEgyQ5ky5fHNsPfg`;

export default function Map() {

    //get stork data
    //plot on map with mapbox

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(42.1986742);
    const [lat, setLat] = useState(2);
    const [zoom, setZoom] = useState(2);

    let c: any;
    let ctx: any;
    let scale = 2;
    let storkCoords = [];
    //const [storks, setStorks] = useState<DBStork[]>([]);

    let storks: any;

    let hoveredStork: any;

    async function setStorks(){
        storks = await (await fetch("/api/v1/storks/alive")).json();

        console.log(storks);

        c = document.createElement("canvas");
        c.id = "storksLayer";
        document.getElementsByClassName("mapboxgl-interactive")[0].appendChild(c);

        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("touchmove", update);

        c.width = scale*window.innerWidth;
        c.height = scale*window.innerHeight;

        console.log(document.getElementsByClassName("mapboxgl-interactive")[0].width);

        ctx = c.getContext("2d");
        
        update();
    }

    useEffect(() => {
        if (map.current) {
            return;
        } // initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            projection: "mercator",
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });

        setStorks();
        
    });

    function storkDist(pt: any, storkLoc: any){
        return Math.sqrt((pt.lat - storkLoc.latitude)**2 + (pt.lng - storkLoc.longitude)**2);
    }

    function mouseMove(e: any){
        let mCoords = [e.clientX, e.clientY];

        mCoords = map?.current?.unproject(mCoords);


        for(let i of storks){
            if(storkDist(mCoords, i.lastLocation) < 1){
                console.log(i);
                break;
            }
        }

        //update();
    }

    // DO THIS:  https://docs.mapbox.com/mapbox-gl-js/example/canvas-source/
    function update(){

        c.width = scale*c.clientWidth;
        c.height = scale*c.clientHeight;

        ctx.clearRect(0,0,c.width,c.height);

        ctx.fillStyle = "coral";

        for(let i of storks){
            let tempCoords = [i.lastLocation.longitude, i.lastLocation.latitude];
            let coords = map?.current?.project(tempCoords);
            ctx.beginPath();
            ctx.arc(scale*coords.x, scale*coords.y, 15, 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
            //ctx.fillRect(scale*coords.x - 5, scale*coords.y - 5,10,10);
        }
        requestAnimationFrame(update);
    }

    console.log(storks);

    return <div className="fullscreen">
        <br></br>
        <div className="justify-center items-center flex fullscreen">
            <div ref={mapContainer} className="background" id="map"></div>
        </div>
    </div>;
}