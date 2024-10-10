import { useQuery } from '@tanstack/react-query';

const fetchEarthquakeData = async () => {
  const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
  console.log(response)
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.features.map((feature: any) => ({
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0],
    magnitude: feature.properties.mag,
    place: feature.properties.place,
    date: feature.properties.time,
    id: feature.properties.ids,
  }));
};

export const useEarthquakeData = () => {
  return useQuery({
    queryKey: ['earthquakeData'],
    queryFn: fetchEarthquakeData,
  });
};