import React from 'react';

interface WeatherWidgetProps {
  city: string;
  temp: string;
  aqi: string;
}

export default function WeatherWidget({ city, temp, aqi }: WeatherWidgetProps) {
  return (
    <div className="weather-widget">
      <span>📍 {city}</span>
      <span>🌡️ {temp}</span>
      <span>🍃 AQI: {aqi}</span>
    </div>
  );
}
