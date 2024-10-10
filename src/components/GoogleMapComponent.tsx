import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '80vh',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

interface MarkerData {
  lat: number;
  lng: number;
  magnitude: number;
  place: string;
  id: string;
}

interface Props {
  markers: MarkerData[];
  highlightId: string | null;
}

const GoogleMapComponent: React.FC<Props> = ({ markers, highlightId }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRefs = useRef<google.maps.Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || markers.length === 0) return;
    markerRefs.current.forEach((marker) => marker.setMap(null));
    markerRefs.current = [];
    setTimeout(() => {
      markers.forEach((markerData) => {
        const marker = new google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: mapRef.current!,
          title: `${markerData.place} - Magnitude: ${markerData.magnitude}`,
          icon: {
            url: markerData.id === highlightId
              ? 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        });
        markerRefs.current.push(marker);
      });
    }, 100);
  }, [markers, isMapLoaded, highlightId]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={2}
        onLoad={(map) => {
          mapRef.current = map;
          setIsMapLoaded(true);
        }}
      />
    </LoadScript>
  );
};

export default GoogleMapComponent;
