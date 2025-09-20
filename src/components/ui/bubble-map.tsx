'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RegionalPerformance } from '../../types/marketing';

// Fix for default Leaflet icon not appearing
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// A basic geocoding utility for the mock data.
// In a real-world scenario, you would use a geocoding service.
const getCoordinates = (region: string): [number, number] => {
  switch (region) {
    case 'Abu Dhabi': return [24.4667, 54.3667];
    case 'Dubai': return [25.2048, 55.2708];
    case 'Sharjah': return [25.3575, 55.3995];
    case 'Riyadh': return [24.7136, 46.6753];
    case 'Doha': return [25.2854, 51.5310];
    case 'Kuwait City': return [29.3759, 47.9774];
    case 'Manama': return [26.2285, 50.5860];
    default: return [25.0, 50.0];
  }
};
interface MapRecenterProps {
  data: RegionalPerformance[];
}
interface BubbleMapProps {
  title: string;
  data: RegionalPerformance[];
  valueType: 'revenue' | 'spend' | 'conversions' | 'both';
}

// Custom hook to handle map recentering when data changes
const MapRecenter = ({ data }: MapRecenterProps) => {
  const map = useMap();
  useEffect(() => {
    if (data && data.length > 0) {
      const bounds = L.latLngBounds(data.map(item => getCoordinates(item.region)));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [data, map]);
  return null;
};

// Component to render the text labels for the cities
const CityLabels = ({ data }: { data: RegionalPerformance[] }) => {
  const map = useMap();

  useEffect(() => {
    // Clear existing labels before adding new ones
    map.eachLayer((layer: any) => {
      if (layer.options && layer.options.className === 'city-label') {
        map.removeLayer(layer);
      }
    });

    data.forEach(item => {
      const coordinates = getCoordinates(item.region) as L.LatLngExpression;
      const latLng = L.latLng(coordinates);

      // Create a custom div icon for the label
      const label = L.divIcon({
        className: 'city-label',
        html: `<div class="text-xs font-semibold whitespace-nowrap -ml-2 text-gray-800">${item.region}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      // Add the marker with the label icon to the map
      L.marker(latLng, { icon: label }).addTo(map);
    });
  }, [data, map]);

  return null;
};

export function BubbleMap({ title, data, valueType }: BubbleMapProps) {
  // A simple function to scale the bubble radius
  // Using Math.sqrt for a better visual representation of varying magnitudes
  const getRadius = (value: number, allValues: number[]): number => {
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min;
    const scaledValue = (value - min) / range;
    return 5 + scaledValue * 20; // Scale radius from 5 to 25
  };

  let markers: React.ReactElement[] = [];

  if (valueType === 'both') {
    const revenueValues = data.map(d => d.revenue);
    const spendValues = data.map(d => d.spend);
    data.forEach((item, index) => {
      const coordinates = getCoordinates(item.region);
      // Revenue marker
      const revValue = item.revenue;
      const revRadius = getRadius(revValue, revenueValues);
      markers.push(
        <CircleMarker
          key={`revenue-${index}`}
          center={coordinates as L.LatLngExpression}
          radius={revRadius}
          pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.5 }}
        >
          <Popup>
            <div className="font-semibold text-sm">
              {item.region}, {item.country}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Revenue: {revValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
          </Popup>
        </CircleMarker>
      );
      // Spend marker
      const spendValue = item.spend;
      const spendRadius = getRadius(spendValue, spendValues);
      markers.push(
        <CircleMarker
          key={`spend-${index}`}
          center={coordinates as L.LatLngExpression}
          radius={spendRadius}
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.5 }}
        >
          <Popup>
            <div className="font-semibold text-sm">
              {item.region}, {item.country}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Spend: {spendValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
          </Popup>
        </CircleMarker>
      );
    });
  } else {
    const values = data.map(d => d[valueType as 'revenue' | 'spend' | 'conversions']);
    const color = valueType === 'revenue' ? '#3b82f6' : valueType === 'spend' ? '#ef4444' : '#10b981';
    data.forEach((item, index) => {
      const coordinates = getCoordinates(item.region);
      const value = item[valueType as 'revenue' | 'spend' | 'conversions'];
      const radius = getRadius(value, values);
      markers.push(
        <CircleMarker
          key={index}
          center={coordinates as L.LatLngExpression}
          radius={radius}
          pathOptions={{ color, fillColor: color, fillOpacity: 0.5 }}
        >
          <Popup>
            <div className="font-semibold text-sm">
              {item.region}, {item.country}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {valueType === 'revenue' ? 'Revenue' : valueType === 'spend' ? 'Spend' : 'Conversions'}: {valueType === 'conversions' ? value : value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
          </Popup>
        </CircleMarker>
      );
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full h-[500px] flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      {data.length === 0 ? (
        <div className="flex flex-grow items-center justify-center text-gray-500">
          No regional data available.
        </div>
      ) : (
        <div className="flex-grow">
          <MapContainer
            center={[25.2, 55.2]}
            zoom={6}
            scrollWheelZoom={false}
            className="w-full h-full rounded-lg"
            key={valueType} // Key to force re-render on valueType change
          >
     <TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
/>
            <MapRecenter data={data} />
            <CityLabels data={data} />
            {markers}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
