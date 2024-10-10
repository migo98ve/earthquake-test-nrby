import React, { useState } from 'react';
import './App.css';
import GoogleMapComponent from './components/GoogleMapComponent';
import { useEarthquakeData } from './components/useEarthquakeData.ts';
import { Card, Button } from 'react-bootstrap';
import Logo from './assets/logo.png';

const App: React.FC = () => {
  const { data: earthquakeData, isLoading, error } = useEarthquakeData();
  const [selectedEarthquakeId, setSelectedEarthquakeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

  if (isLoading) return <div>Loading data...</div>;
  if (error) return <div>Error loading data.</div>;

  if (!earthquakeData || earthquakeData.length === 0) {
    return <div>No earthquake data available.</div>;
  }

  const handleEarthquakeClick = (id: string) => {
    setSelectedEarthquakeId(id);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleReset = () => {
    setSelectedEarthquakeId(null);
    setSearchTerm('');
  };

  // Filtra la lista de terremotos según el término de búsqueda
  const filteredMarkers = earthquakeData.filter((earthquake: any) =>
    earthquake.place.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedMarkers = selectedEarthquakeId
    ? filteredMarkers.filter((marker: any) => marker.id === selectedEarthquakeId)
    : filteredMarkers;

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Earthquake List</h2>
        <input
          type="search"
          className="form-control mb-3"
          placeholder="Search Earthquakes..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button  className="mb-3 nrby" onClick={handleReset}>
          Reset
        </Button>
        {filteredMarkers.map((earthquake: any) => (
          <Card
            key={earthquake.id}
            className={`mb-2 ${selectedEarthquakeId === earthquake.id ? 'border-primarys' : ''}`}
            onClick={() => handleEarthquakeClick(earthquake.id)}
            style={{ cursor: 'pointer' }}
          >
            <Card.Body style={{ padding: '8px' }}>
              <Card.Title style={{ fontSize: '0.9rem' }}>{earthquake.place}</Card.Title>
              <Card.Text style={{ fontSize: '0.75rem' }}>
                Magnitude: {earthquake.magnitude}
                <br />
                Date: {new Date(earthquake.date).toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className="map-container justify-content-center align-items-center">
        <img src={Logo} alt="Earthquake Logo" className="img-fluid" />
        <GoogleMapComponent markers={displayedMarkers} highlightId={selectedEarthquakeId} />
      </div>
    </div>
  );
};

export default App;
