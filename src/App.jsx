import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLocation(null);
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const apiKey = import.meta.env.VITE_API_KEY;

      const response = await axios.get(`${baseUrl}search.php`, {
        params: {
          q: address,
          format: 'json',
          key: apiKey,
        },
      });

      if (response.data && response.data.length > 0) {
        setLocation(response.data[0]);
      } else {
        setError('Location not found');
      }
    } catch (err) {
      setError('Error fetching location: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Geocoder</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter an address"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {location && (
        <div className="result">
          <h2>{location.name}</h2>
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lon}</p>
          {location.address && <p><strong>Address:</strong> {location.address}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
