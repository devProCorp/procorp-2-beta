'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const COORDS: [number, number] = [4.703564064031687, -74.02902301520666]; // Centro Empresarial Acces Bogotá 127

export default function FooterMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current, {
            center: COORDS,
            zoom: 14,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
        });

        // Carto dejó de servir teselas sin clave: pinta «API KEY REQUIRED» encima del
        // mapa. OpenStreetMap no pide clave pero sí atribución; .mapa-oscuro lo oscurece.
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            className: 'mapa-oscuro',
            attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
        }).addTo(map);
        L.control.attribution({ prefix: false }).addTo(map);

        // Custom red marker
        const icon = L.divIcon({
            className: '',
            html: `<div style="
                width: 16px; height: 16px;
                background: #CE1026;
                border: 2px solid rgba(255,255,255,0.9);
                border-radius: 50%;
                box-shadow: 0 0 20px rgba(206,16,38,0.6), 0 0 40px rgba(206,16,38,0.3);
            "></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });

        L.marker(COORDS, { icon }).addTo(map);

        mapInstance.current = map;

        return () => {
            map.remove();
            mapInstance.current = null;
        };
    }, []);

    return <div ref={mapRef} className="absolute inset-0 w-full h-full" />;
}
