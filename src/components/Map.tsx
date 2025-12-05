import React from 'react';

interface MapProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    lng: number;
    lat: number;
    title: string;
    description?: string;
  }>;
}

const Map: React.FC<MapProps> = ({ 
  className = "w-full h-[320px]", 
  center = [56.168070, 40.383611], // Lat, Lng for Vladimir
  zoom = 16,
  markers = []
}) => {
  // Generate Yandex Maps URL with markers
  const generateYandexMapUrl = () => {
    const baseUrl = 'https://yandex.ru/map-widget/v1/';
    const lat = center[0];
    const lng = center[1];
    
    // Build URL with parameters
    const params = new URLSearchParams({
      ll: `${lng},${lat}`,
      z: zoom.toString(),
      l: 'map',
      mode: 'whatshere',
      whatshere: `${lng},${lat}`,
    });

    // Add markers if provided
    if (markers.length > 0) {
      markers.forEach((marker, index) => {
        params.append(`pt${index}`, `${marker.lng},${marker.lat},pm2rdm`);
      });
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className={`relative ${className}`}>
      <iframe
        src={generateYandexMapUrl()}
        className="absolute inset-0 w-full h-full rounded-lg border-0"
        allowFullScreen
        title="Yandex Map"
        loading="lazy"
      />
    </div>
  );
};

export default Map;