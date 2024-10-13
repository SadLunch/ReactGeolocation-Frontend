import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import io from 'socket.io-client';

const socket = io.connect('https://reactgeolocation-backend.onrender.com'); // Replace with your backend URL

const MapPage = () => {
  const [position, setPosition] = useState([51.505, -0.09]);

  useEffect(() => {
    // Request user location and update on the map
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        // Emit user's position to the backend via WebSocket
        socket.emit('send-location', { lat: latitude, lng: longitude });
      });
    }
    
    // Listen for updates of other users' locations
    socket.on('user-location', (data) => {
      console.log("Other user's location: ", data);
      // Handle other users' locations (e.g., update markers)
    });
  }, []);

  return (
    <div>
      <h1>Map Page</h1>
      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}></Marker>
      </MapContainer>
    </div>
  );
};

export default MapPage;
